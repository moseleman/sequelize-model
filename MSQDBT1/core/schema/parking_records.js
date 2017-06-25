
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'parking_records',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			lotCode: { // 停車場站
				field: 'lot_code',
				type: DataTypes.STRING,
				allowNull: true
			},
			entered_at: { // 進場時間
				type: DataTypes.DATE,
				allowNull: true
			},
			exited_at: { // 出場時間
				type: DataTypes.DATE,
				allowNull: true
			},
			entry_type: { // 進場方式 1:車牌 2:會員卡
				type: DataTypes.INTEGER,
				allowNull: false
			},
			entry_value: { // 進場 車牌/會員卡 編號
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			timestamps: false,
			classMethods: {
				associate: function(models) {
					def.hasMany(models.parking_record_details)
				}
			}
		})

		return def
}
