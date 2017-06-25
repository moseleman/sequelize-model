let fs = require('fs')
let path = require('path')
let Sequelize = require('sequelize')
let g_config = require('./config.json')

let g_data = []

let g_info
let g_list = g_config.accounts
Object.keys(g_list).forEach(name => {
	g_info = {}
	g_info['name'] = name
	g_info['dialect'] = g_config.dialect
	g_info['dbname'] = g_config.dbname
	g_info['host'] = g_config.host
	g_info['port'] = g_config.port
	g_info['account'] = g_list[name].account
	g_info['password'] = g_list[name].password

	g_data.push(g_info)
})

// ===== OBJECT =====
let g_db // {default: [Sequelize Object], ...}

function DB(data) {
	let sequelize = new Sequelize(
		data.dbname, data.account, data.password,
		{
			'dialect': data.dialect,
			'host': data.host,
			'port': data.port
		}
	)

	let self = this
	fs.readdirSync(`${__dirname}/schema`)
	.filter((file) => {
		return file.endsWith('.js')
	})
	.forEach((file) => {
		let model = sequelize.import(path.join(`${__dirname}/schema`, file))
		self[model.name] = model
	})

	Object.keys(self).forEach((modelName) => {
		if ("associate" in self[modelName]) {
			self[modelName].associate(self)
		}
	})

	self.sequelize = sequelize
	self.Sequelize = Sequelize
}

DB.getService = function(name = 'default') {
	if (g_db == null) {
		let obj
		g_db = {}
		g_data.forEach(info => {
			obj = new DB(info)
			g_db[info.name] = obj
		})
	}

	return g_db[name]
}

module.exports = DB
