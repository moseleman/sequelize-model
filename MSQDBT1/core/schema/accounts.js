
module.exports = function(sequelize, DataTypes) {
	let def = sequelize.define(
		'accounts',
		{
			id: { // 流水號
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			name: { // 姓名 
				type: DataTypes.STRING,
				allowNull: false
			},
			sex: { // 性別
				type: DataTypes.STRING,
				allowNull: false
			},
			birthday: { // 生日
				type: DataTypes.DATE,
				allowNull: false
			},
			email: { // email
				type: DataTypes.STRING,
				allowNull: false
			},
			address: { // 地址
				type: DataTypes.STRING,
				allowNull: false
			},
			national_id: { // 身分證字號
				type: DataTypes.STRING,
				allowNull: false
			},
			reg_status: { // 註冊狀態
				type: DataTypes.INTEGER,
        allowNull: false
			},
			carrier: { // 發票載具
				type: DataTypes.INTEGER,
        allowNull: false
			},
			created_at: { // 帳號建立時間
				type: DataTypes.DATE,
        allowNull: false
			},
			is_blocked: { // 是否鎖帳號
				type: DataTypes.BOOLEAN,
				allowNull: false
			}
		},
		{
			timestamps: false,
			classMethods: {
				associate: function(models) {
					def.hasMany(models.memberships),
					def.hasMany(models.cars),
					def.hasMany(models.phones),
					def.hasMany(models.invitation_code),
					def.hasMany(models.parking_record_details),
					def.hasMany(models.orders),
					def.hasMany(models.credit_cards),
					def.hasMany(models.customer_records)
				}
			}
		})

		return def
}
