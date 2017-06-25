
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'customer_records',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			crmUserId: { // 客服專員id
				field: 'crm_user_id',
				type: DataTypes.BIGINT,
				allowNull: false
			},
			source: { // 消息來源
				type: DataTypes.INTEGER,
				allowNull: false
			},
			type: { // 問題類型
				type: DataTypes.INTEGER,
				allowNull: false
			},
			lot_name: { // 停車場站名稱
				type: DataTypes.BIGINT,
				allowNull: true
			},
			status: { // 處理狀態
				type: DataTypes.INTEGER,
				allowNull: false
			},
			reason: { // 問題分析
				type: DataTypes.STRING,
				allowNull: false
			},
			content: { // 詳細內容
				type: DataTypes.TEXT,
				allowNull: false
			},
			accountId: { // 會員id
				field: 'account_id',
				type: DataTypes.BIGINT,
				allowNull: false
			},
			order_num: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			//timestamps: false,
			classMethods: {
				associate: function(models) {
					def.belongsTo(models.accounts),
					def.belongsTo(models.crm_users)
				}
			}
		})

		return def
}
