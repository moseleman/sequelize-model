
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'banks',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			code: { // 銀行代號
				type: DataTypes.INTEGER,
				allowNull: false
			},
			name: { // 名稱
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			timestamps: false,
			classMethods: {
				associate: function(models) {
				}
			}
		})

		return def
}
