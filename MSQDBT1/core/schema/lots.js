
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'lots',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			code: { // 車場編號
				type: DataTypes.STRING,
				allowNull: false
			},
			name: { // 名稱
				type: DataTypes.STRING,
				allowNull: false
			},
			address_for_list: { // 地址
				type: DataTypes.STRING,
				allowNull: false
			},
			phone_display: { // 電話
				type: DataTypes.STRING,
				allowNull: false
			},
			free_parking: { // 幾分鐘內免費停車
				type: DataTypes.INTEGER,
				allowNull: false
			},
			is_active: { // 是否啟用
				type: DataTypes.BOOLEAN,
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
