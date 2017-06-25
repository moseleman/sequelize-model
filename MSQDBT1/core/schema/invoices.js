
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'invoices',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			status: { // 狀態
				type: DataTypes.INTEGER,
				allowNull: false
			},
			carrier: { // 載具
				type: DataTypes.INTEGER,
				allowNull: false
			},
			num: { // 發票號碼
				type: DataTypes.STRING,
				allowNull: false
			},
			vat: { // 統一編號
				type: DataTypes.STRING,
				allowNull: false
			},
			title: { // 公司抬頭
				type: DataTypes.STRING,
				allowNull: false
			},
			orderId: { // 訂單編號
				field: 'order_id',
        type: DataTypes.BIGINT,
        allowNull: false
      }
		},
		{
			timestamps: false,
			classMethods: {
				associate: function(models) {
					def.belongsTo(models.orders)
				}
			}
		})

		return def
}
