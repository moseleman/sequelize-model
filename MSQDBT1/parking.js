let moment = require('moment')
let DB = require('./core/db.js')
let g_service = DB.getService()
let g_msg = require(`${__managerpath}/message/message.js`)

function Parking() {}

Parking.getParkingLotName = async function(lotCodeArr) {
	
	let list = []

	await g_service.lots.findAll({
		attributes: ['code', 'name'],	
		where: {
			code: {
				$or: lotCodeArr
			}
		}
	}).then((reply) => {
		//console.log(`reply: ${JSON.stringify(reply, null, 2)}`)
		if (reply == null)
			return

		let row
		for (let i = 0; i < reply.length; i++) {
      row = {}
			row['code'] = reply[i].get('code')
			row['name'] = reply[i].get('name')
			list.push(row)
		}
	}).catch(e => {
    console.error(e)
    throw `[CRM] Parking.getParkingLotName fail. ${e}`
  })

	//console.log(`list: ${JSON.stringify(list, null, 2)}`)
	return list
}

/*
 * infoArr: 車牌, 會員卡 array or string
 * */
Parking.getParkingRecords = async function(infoArr, limit = 3) {

	let list = []

	if (typeof infoArr === 'string')
		infoArr = [infoArr]

	await g_service.parking_records.findAll({
		limit: limit,
		order: [['entered_at', 'DESC']],
		attributes: [
			'id', 'lot_code', 'entered_at',
			'exited_at', 'entry_type', 'entry_value'
		],
		where: {
			entry_value: {
				$or: infoArr //['AMY1957', ...]
			}
		}
	}).then((reply) => {
		if (reply == null)
			return

		let row
		for (let i = 0; i < reply.length; i++) {
			row = {}
			row['id'] = reply[i].get('id')
			row['lotCode'] = reply[i].get('lot_code')
			row['entryType'] = reply[i].get('entry_type')
			row['entryValue'] = reply[i].get('entry_value')
			row['enteredAt'] = reply[i].get('entered_at')
			row['exitedAt'] = reply[i].get('exited_at')

			list.push(row)
		}
	}).catch(e => {
		console.error(e)
		throw `[CRM] Parking.getParkingRecords fail. ${e}`
	})

	return list
}

Parking.getCarLockInfoList = async function(accountId) {

	let list = []

	await g_service.parking_record_details.findAll({
		attributes: ['is_lock', 'parking_record_id'],
		where: {
			account_id: accountId
		}
	}).then((reply) => {
		//console.log(`detail reply: ${JSON.stringify(reply, null, 2)}`)
		if (reply == null)
			return

		let row
		for (let i = 0; i < reply.length; i++) {
			row = {}
			row['id'] = reply[i].get('parking_record_id')
			row['isLock'] = reply[i].get('is_lock')
			list.push(row)
		}
	}).catch(e => {
		console.error(e)
		throw `[CRM] Parking.getCarLockInfo fail. ${e}`
	})

	return list
}


module.exports = Parking

