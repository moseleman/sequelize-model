
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'parking_record_details',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			accountId: { // 帳號
				field: 'account_id',
				type: DataTypes.BIGINT
			},
			parkingRecordId: { // 停車紀錄id
				field: 'parking_record_id',
				type: DataTypes.BIGINT
			},
			lotId: { // 車場id
				field: 'lot_id',
        type: DataTypes.BIGINT
			},
			orderId: { // 訂單id
				field: 'order_id',
				type: DataTypes.BIGINT
			},
			is_lock: { // 鎖車
				type: DataTypes.BOOLEAN,
				allowNull: false
			}
		},
		{
			timestamps: false,
			classMethods: {
				associate: function(models) {
					def.belongsTo(models.accounts),
					def.belongsTo(models.parking_records),
					def.belongsTo(models.orders),
					def.belongsTo(models.lots)
				}
			}
		})

		return def
}
