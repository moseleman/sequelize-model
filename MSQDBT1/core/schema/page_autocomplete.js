
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'page_autocomplete',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			system_name: { // 使用的系統名稱
				type: DataTypes.STRING,
				allowNull: false
			},
			json_code: { // 儲存資料
				type: DataTypes.TEXT,
				allowNull: false
			},
			enable: { // 啟用停用
				type: DataTypes.BOOLEAN,
				allowNull: false
			}
		},
		{
			freezeTableName: true,
			createdAt: 'created_at',
      updatedAt: 'updated_at',
			classMethods: {
				associate: function(models) {
				}
			}
		})

		return def
}
