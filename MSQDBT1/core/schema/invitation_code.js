
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'invitation_code',
		{
			accountId: { // 帳號
				field: 'account_id',
				type: DataTypes.BIGINT
			},
			code: { // 邀請碼
				type: DataTypes.STRING,
			}
		},
		{
			timestamps: false,
			freezeTableName: true,
			classMethods: {
				associate: function(models) {
					def.belongsTo(models.accounts)
				}
			}
		})

		return def
}
