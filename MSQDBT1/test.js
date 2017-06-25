require('../../../define.js')

//const Parking = require('./parking.js')

//Parking.getParkingLotName(['DDHTPC004'])

const Crm = require('./crm.js')

let obj = {}
//obj['startDate'] = new Date(`2017-06-14 11:20:35`)
//obj['endDate'] = new Date(`2017-06-14 11:20:50`)
obj['startDate'] = new Date(`2017-06-14`)
Crm.getAllCustomerRecords(obj).then(reply => {
	console.log(`reply: ${JSON.stringify(reply,null,2)}`)
})

//Crm.updateUser('Mila', {enable:false})

//Crm.getAllCustomerRecordList(5036)

//Crm.insertUser('jessica', false)

//let data = {}
//data['name'] = 'momo'
//data['enable'] = true
//Crm.updateUser('momo', data)

/*
Crm.getUserList('all').then(reply => {
	console.log(`reply: ${JSON.stringify(reply)}`)
})
*/

/*
let data = {}
data['userId'] = 1
data['source'] = 1
data['type'] = 1
data['lot_name'] = '內湖堤頂站'
data['status'] = 1
data['reason'] = {list:['測試用']}
data['content'] = '測試用內容'
data['accountId'] = 5036
Crm.insertRecord(data)
*/

/*
Crm.updatePageAutoComplete('crm/record', {analysis:['手動加入測試01', '手動加入測試02', '手動加入測試03']})
.then(reply => {
	console.log(`${JSON.stringify(reply)}`)
})
*/
