let moment = require('moment')
let DB = require('./core/db.js')
let g_service = DB.getService()
let g_msg = require(`${__managerpath}/message/message.js`)

function Crm() {}

Crm.insertUser = async function(name, enable = true) {

	await g_service.crm_users.findOne({
		attributes:['name', 'enable'],
		where: { name:name }
	}).then(reply => {
		if (reply != null)
			return

		let row = {}
		row['name'] = name
		row['enable'] = enable
		g_service.crm_users.create(row)
		.catch(e => { console.error(e) })
	}).catch(e => { console.error(e) })

	return true
}

Crm.updateUser = async function(name, data) {

	let row = {}
	if (data.hasOwnProperty('name') === true)
		row['name'] = data['name']

	if (data.hasOwnProperty('enable') === true)
		row['enable'] = data['enable']

	await g_service.crm_users.update(
		row,
		{ where: { name:name }}
	).catch(e => { console.error(e) })

  return true
}

Crm.getUserList = async function(enable = true) {

	let condition = {}
	if (enable !== 'all') {
		condition['enable'] = enable
	}

	let result = []
	await g_service.crm_users.findAll({
		attributes:['id', 'name', 'enable'],
		where: condition
	}).then(reply => {
		//console.log(`reply: ${JSON.stringify(reply,null,2)}`)
		let row
		for (let i = 0; i < reply.length; i++) {
			row = {}
			row['id'] = reply[i].get('id')
	    row['name'] = reply[i].get('name')
  	  row['enable'] = reply[i].get('enable')

			result.push(row)
		}
	}).catch(e => {
    console.error(e)
  })

	return result
}

Crm.insertRecord = async function(data) {

	let row = {}
	row['crmUserId'] = data['userId']
	row['source'] = data['source']
	row['type'] = data['type']
	row['lot_name'] = data['lotName']
	row['status'] = data['status']
	row['content'] = data['content']
	row['accountId'] = data['accountId']
	row['order_num'] = data['orderNum']

	let reason = data['reason']
	row['reason'] = reason
	if (typeof reason === 'object') {
		row['reason'] = JSON.stringify(reason)
	}
	//console.log(`row: ${JSON.stringify(row,null,2)}`)

	let result = {}
	await g_service.customer_records.create(row)
	.then(reply => {
		//console.log(`insert: ${JSON.stringify(reply,null,2)}`)
		result['id'] = reply.get('id')
	})
	.catch(e => { console.error(e) })

	return result
}

Crm.updateRecordContent = async function(recordId, content) {

  await g_service.customer_records.update(
		{ content: content },
    { where: { id: recordId }}
  ).catch(e => { console.error(e) })

  return true
}

Crm.updateRecord = async function(recordId, data) {

	let row = {}
  row['crmUserId'] = data['userId']
  row['source'] = data['source']
  row['type'] = data['type']
  row['lot_name'] = data['lotName']
  row['status'] = data['status']
  row['content'] = data['content']
  row['accountId'] = data['accountId']
	row['order_num'] = data['orderNum']

  let reason = data['reason']
  row['reason'] = reason
  if (typeof reason === 'object') {
    row['reason'] = JSON.stringify(reason)
  }
  //console.log(`row: ${JSON.stringify(row,null,2)}`)

  await g_service.customer_records.update(
		row,
		{ where: { id: recordId }}
	).catch(e => { console.error(e) })

  return true
}

Crm.getPersonCustomerRecordList = async function(accountId) {

	let result = []

	await g_service.customer_records.findAll({
		where: { accountId:accountId },
		order: [['created_at', 'DESC']],
		attributes: ['id', 'crm_user_id', 'created_at', 'type', 'lot_name', 'status'],
		include: [
			{
				model: g_service.crm_users,
				attributes: ['name']
			}
		]
	}).then(reply => {
		if (reply == null)
			return
		//console.log(`${JSON.stringify(reply,null,2)}`)
		let row, userName, data
		for (let i = 0; i < reply.length; i++) {
			row = {}
			row['id'] = reply[i].get('id')
			row['userId'] = reply[i].get('crm_user_id')
			row['createdAt'] = reply[i].get('created_at')
			row['type'] = reply[i].get('type')
			row['status'] = reply[i].get('status')
			row['lotName'] = reply[i].get('lot_name')

			data = reply[i].get('crm_user')
			userName = ''
			if (data != null)
				userName = data.name
			row['userName'] = userName

			result.push(row)
		}
	}).catch(e => { console.error(e) })

	//console.log(`${JSON.stringify(result,null,2)}`)
	return result
}

Crm.getCustomerRecord = async function(recordId) {

	let result

	await g_service.customer_records.findOne({
		where: { id:recordId },
		attributes: ['crm_user_id', 'source', 'type', 'lot_name', 'status', 'reason', 'content', 'created_at', 'order_num'],
		include: [
      {
        model: g_service.crm_users,
        attributes: ['name']
      }
    ]
	}).then(reply => {
		//console.log(`reply: ${JSON.stringify(reply,null,2)}`)
		result = {}
		result['source'] = reply.get('source')
    result['type'] = reply.get('type')
    result['lotName'] = reply.get('lot_name')
    result['status'] = reply.get('status')
    result['reason'] = reply.get('reason')
    result['content'] = reply.get('content')
    result['createdAt'] = reply.get('created_at')
		result['orderNum'] = reply.get('order_num')

		let userId = reply.get('crm_user_id')
		let data = reply.get('crm_user')
		let userName = ''
		if (data != null)
			userName = data.name

		result['user'] = {id:userId,name:userName}

	}).catch(e => { console.error(e) })

	//console.log(`result: ${JSON.stringify(result,null,2)}`)
	return result
}

Crm.getAllCustomerRecords = async function(data) {

	let result = []

	let condition = {}, sub = {}
	let startDate = data.startDate
	if (startDate instanceof Date)
		sub['$gte'] = startDate

	let endDate = data.endDate
  if (endDate instanceof Date)
    sub['$lte'] = endDate

	if (Object.keys(sub).length !== 0) {
		condition['created_at'] = sub	
	}

	//console.log(`condition: ${JSON.stringify(condition)}`)
	await g_service.customer_records.findAll({
		attributes: [
			'crm_user_id', 'source', 'type', 'lot_name',
			'status', 'reason', 'created_at', 'account_id',
			'order_num'
		],
		where: condition,
		order: [['created_at', 'DESC']],
		include: [
			{
				model: g_service.accounts,
				attributes: ['name']
			}
		]
	}).then(reply => {
		//console.log(`reply: ${JSON.stringify(reply,null,2)}`)	
		let row, obj, num, customer
		for (let i = 0; i < reply.length; i++) {
			row = {}
			row['source'] = reply[i].get('source')
			row['type'] = reply[i].get('type')
			row['lotName'] = reply[i].get('lot_name')
			row['status'] = reply[i].get('status')
			row['createdAt'] = reply[i].get('created_at')
			row['accountId'] = reply[i].get('account_id')

			num = reply[i].get('order_num')
			if (num != null)
				row['orderNum'] = reply[i].get('order_num')

			obj = JSON.parse(reply[i].get('reason'))
			row['reason'] = []
			if (obj.hasOwnProperty('list') === true)
				row['reason'] = obj.list

			customer = reply[i].get('account')
			if (customer != null) 
				row['customer'] = customer.name

			result.push(row)
		}
	}).catch(e => {console.error(e)})

	//console.log(`result: ${JSON.stringify(result,null,2)}`)
	return result
}

Crm.updatePageAutoComplete = async function(name, data, enable = true) {

	let result
	await g_service.page_autocomplete.findOne({
		attributes:['json_code'],
		where: {system_name:name}
	}).then(async (reply) => {
		let row = {}
		row['system_name'] = name
		row['enable'] = enable
		row['json_code'] = JSON.stringify(data)

		if (reply == null) {
			await g_service.page_autocomplete.create(row)
			.then(reply => {
				result = JSON.parse(reply.get('json_code'))
			}).catch(e => {console.error(e)})
			return
		}

		let jsonCode = JSON.parse(reply.get('json_code'))
		result = Object.assign({}, jsonCode, data)
		row['json_code'] = JSON.stringify(result)

		g_service.page_autocomplete.update(
			row,
			{ where:{system_name:name} }
		).catch(e => {console.error(e)})
	}).catch(e => {console.error(e)})

	return result
}

Crm.getPageAutoComplete = async function(name) {

	let result = {}
	await g_service.page_autocomplete.findOne({
		attributes:['json_code'],
		where: {system_name:name}
	}).then(reply => {
		if (reply == null) {
			return
		}

		result = JSON.parse(reply.get('json_code'))
	}).catch(e => {console.error(e)})

	return result
}


module.exports = Crm
