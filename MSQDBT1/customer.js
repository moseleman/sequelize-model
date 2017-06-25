let moment = require('moment')
let DB = require('./core/db.js')
let g_service = DB.getService()
let g_msg = require(`${__managerpath}/message/message.js`)

function Customer() {}

/*
 * 手機,會員卡,車號,邀請碼
 */
Customer.getAccountId = async function(code) {

	let length = code.length
	let verify
	if (length === 10) { // 手機
		verify = /^[0-9]/
		if (verify.test(code)) {
			return getAccountIdByPhone(code)
		}
	}
	else if (code.includes('-')) { // 車號
		verify = /^[a-zA-Z0-9]{2,4}\-[a-zA-Z0-9]{2,4}/
		if (verify.test(code)) {
			return getAccountIdByCar(code.toUpperCase())
		}
	}
	else if (length === 8) { // 會員卡
		verify = /^[a-zA-Z0-9]/
		if (verify.test(code)) {
			return getAccountIdByMembership(code.toUpperCase())
		}
	}
	else if (code.length === 6) { // 邀請碼
		verify = /^[a-zA-Z0-9]/
		if (verify.test(code)) {
			return getAccountIdByInvitation(code.toUpperCase())
		}
	}

	return g_msg.error('4004')
}

async function getAccountIdByPhone(code) {

	let accountId

	// phones
	await g_service.phones.findOne({
		attributes:['account_id'],
		where: {
			number: code
		}
	}).then((reply) => {
		//console.log(`reply: ${JSON.stringify(reply)}`)

		if (reply != null) {
			accountId = reply.get('account_id')
		}
	}).catch(e => {
		console.error(e)
		throw `[CRM] getAccountIdByPhone fail. ${e}` 
	})

	if (accountId == null)
		return g_msg.error('4001')

	return accountId
}

async function getAccountIdByCar(code) {

	let accountId

	await g_service.cars.findOne({
		attributes:['account_id'],
		where: {
			plate_display: code
		}
	}).then((reply) => {
		//console.log(`reply: ${JSON.stringify(reply)}`)

		if (reply != null) {
			accountId = reply.get('account_id')
		}
	}).catch(e => {
		console.error(e)
		throw `[CRM] getAccountIdByCar fail. ${e}`
	})

	if (accountId == null)
		return g_msg.error('4002')

	return accountId
}

async function getAccountIdByMembership(code) {

	let accountId

	// membership、account
	await g_service.memberships.findOne({
		attributes:['account_id'],
		where: {
			code: code
		}
	}).then((reply) => {
		//console.log(`reply: ${JSON.stringify(reply)}`)

		if (reply != null) {
			accountId = reply.get('account_id')
		}
	}).catch(e => {
		console.error(e)
		throw `[CRM] getAccountIdByMembership fail. ${e}`
	})

	if (accountId == null)
		return g_msg.error('4000')

	return accountId
}

async function getAccountIdByInvitation(code) {

	let accountId

	await g_service.invitation_code.findOne({
		attributes:['account_id'],
		where: {
			code: code
		}
	}).then((reply) => {
		//console.log(`reply: ${JSON.stringify(reply)}`)

		if (reply != null) {
			accountId = reply.get('account_id')
		}
	}).catch(e => {
		console.error(e)
		throw `[CRM] getAccountIdByInvitation fail. ${e}`
	})

	if (accountId == null)
		return g_msg.error('4003')

	return accountId
}

Customer.getAccount = async function(accountId) {

	let account

	await g_service.accounts.findOne({
		attributes:['account'],
		where: {
			id: accountId
		}
	}).then((reply) => {
		if (reply != null) {
			account = reply.get('account')
		}
	}).catch(e => {
		console.error(e)
		throw `[CRM] getAccount fail. ${e}`
	})

	if (account == null)
		return g_msg.error('4005')

	return account
}

/*
 * 獲得使用者的信用卡資訊
 */
Customer.getCreditInfoByAccountId = async function(accountId) {

	let result = [], bankArr = []

	await g_service.credit_cards.findAll({
		order: [['created_at', 'DESC'], ['discount', 'ASC']],
		attributes: [
			'id', 'bank_code', 'card_number', 'card_number_public', 'expiry',
			'created_at', 'default_credit_card', 'discount', 'status'
		],
		where: {
			accountId: accountId
		}
	}).then((reply) => {
		//console.log(`reply: ${JSON.stringify(reply, null, 2)}`)
		if (reply == null)
			return

		let row, expiry, defaultBool
		for (let i = 0; i < reply.length; i++) {
			expiry = reply[i].get('expiry')
			if (expiry == null)
				continue

			row = {}
			row['id'] = reply[i].get('id')
			row['bankCode'] = reply[i].get('bank_code')
			row['expiry'] = reply[i].get('expiry')
			row['createdAt'] = reply[i].get('created_at')
			row['status'] = reply[i].get('status')
			row['defaultCreditCard'] = reply[i].get('default_credit_card')
			row['discount'] = reply[i].get('discount')
			row['cardNumberPublic'] = reply[i].get('card_number_public')

			result.push(row)
			bankArr.push(reply[i].get('bank_code'))
		}
	}).catch(e => {
		console.error(e)
		throw `[CRM] getCreditInfoByAccountId fail. ${e}`
	})

	if (bankArr.length > 0) {
		await g_service.banks.findAll({
			attributes: ['code', 'name'],
			where: {
				code: {
					$or: bankArr
				}
			}
		}).then((reply) => {
			//console.log(`reply: ${JSON.stringify(reply, null, 2)}`)
			let code
			for(let i = 0; i < reply.length; i++) {
				code = reply[i].code
				for(let j = 0; j < result.length; j++) {
					if (code !== result[j].bankCode)
						continue

					result[j]['bankName'] = reply[i].get('name')
				}
			}
		}).catch(e => {
			console.error(e)
			throw `[CRM] getCreditInfoByAccountId fail. ${e}`
		})
	}

	//console.log(`result: ${JSON.stringify(result, null, 2)}`)
	return result
}

/*
 * 獲得使用者的會員卡、車牌資訊
 */
Customer.getPassInfoByAccountId = async function(accountId) {

	let result = {}

	await g_service.memberships.findOne({
		attributes: ['code'],
		where: {
			account_id: accountId
		}
	}).then((reply) => {
		//console.log(`membership reply: ${JSON.stringify(reply, null, 2)}`)
		if (reply != null)
			result['membership'] = reply.get('code')
	}).catch(e => {
		console.error(e)
		throw `[CRM] getPassInfoByAccountId fail. ${e}`
	})

	await g_service.cars.findAll({
		attributes: ['plate', 'plate_display'],
		where: {
			account_id: accountId
		}
	}).then((reply) => {
		//console.log(`cars reply: ${JSON.stringify(reply, null, 2)}`)
		if (reply == null)
			return

		let plate = [], cars = [], row
		for (let i = 0; i < reply.length; i++) {
			plate.push(reply[i].get('plate'))

			row = {}
			row['plate'] = reply[i].get('plate')
			row['plateDisplay'] = reply[i].get('plate_display')
			cars.push(row)
		}
		result['plate'] = plate
		result['cars'] = cars

	}).catch(e => {
		console.error(e)
		throw `[CRM] getPassInfoByAccountId fail. ${e}`
	})

	//console.log(`result: ${JSON.stringify(result, null, 2)}`)
	return result //{membership,cars,plate}
}


module.exports = Customer

