
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'payment_details',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			created_at: { // 創建日期
        type: DataTypes.DATE,
        allowNull: false
      },
			type: { // 交易形態
				type: DataTypes.BIGINT,
				allowNull: false
			},
			amount: { // 金額
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			orderId: { // 訂單編號
				field: 'order_id',
				type: DataTypes.BIGINT,
				allowNull: false
			},
			more: { // 追加紀錄
				type: DataTypes.TEXT,
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
