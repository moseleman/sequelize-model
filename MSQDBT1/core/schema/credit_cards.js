
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'credit_cards',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			accountId: { // 帳號
				field: 'account_id',
				type: DataTypes.BIGINT,
				allowNull: false
			},
			bank_code: { // 銀行代號
				type: DataTypes.INTEGER,
				allowNull: false
			},
			card_number: { // 信用卡號 加密
        type: DataTypes.STRING,
        allowNull: true
      },
			card_number_public: { // 前6後4 信用卡號
				type: DataTypes.STRING,
        allowNull: false
			},
			expiry: { // 到期日
				type: DataTypes.CHAR(4),
				allowNull: false
			},
			created_at: { // 更新日期
				type: DataTypes.DATE,
				allowNull: false
			},
			default_credit_card: { // 預設信用卡
				type: DataTypes.BOOLEAN,
        allowNull: false
			},
			discount: {
				type: DataTypes.INTEGER, // 優惠信用卡順番
        allowNull: false
			},
			status: { // 狀態
				type: DataTypes.INTEGER(1),
				allowNull: false
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
