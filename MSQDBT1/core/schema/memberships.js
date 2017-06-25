
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'memberships',
		{
			code: { // 俥酷卡號
				type: DataTypes.STRING,
				allowNull: false
			},
			accountId: { // 帳號
				field: 'account_id',
				type: DataTypes.BIGINT
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
