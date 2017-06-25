
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'crm_users',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			name: { // 姓名 
				type: DataTypes.STRING,
				allowNull: false
			},
			enable: { // 啟用
				type: DataTypes.BOOLEAN,
				allowNull: false
			}
		},
		{
			timestamps: false,
			classMethods: {
				associate: function(models) {
					def.hasMany(models.customer_records)
				}
			}
		})

		return def
}
