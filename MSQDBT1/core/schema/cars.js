
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'cars',
		{
			accountId: { // 帳號
				field: 'account_id',
				type: DataTypes.BIGINT
			},
			plate_display: { // 車號
				type: DataTypes.STRING
			}
		},
		{
			timestamps: false,
			classMethods: {
				associate: function(models) {
					def.belongsTo(models.accounts)
				}
			}
		})

		return def
}
