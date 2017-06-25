
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'orders',
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
			order_num: { // 訂單編號
				type: DataTypes.STRING,
				allowNull: false
			},
			accountId: { // 帳號
				field: 'account_id',
				type: DataTypes.BIGINT,
				allowNull: false
			},
			amount: { // 金額
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			paid_amount: { // 實付金額
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			history_data: { // 歷史資料
				type: DataTypes.TEXT,
				allowNull: false
			},
			status: { // 訂單狀態
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			timestamps: false,
			classMethods: {
				associate: function(models) {
					def.belongsTo(models.accounts),
					def.hasMany(models.parking_record_details),
					def.hasMany(models.payment_details),
					def.hasMany(models.invoices)
				}
			}
		})

		return def
}
