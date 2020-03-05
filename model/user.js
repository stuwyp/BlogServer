/**
 * User model module.
 * @file 用户数据模型
 * @module model/user
 */

const {sql,Sequelize} = require('./sequelize')


// 用户模型
let User = sql.define('user',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},

        avatar: {type: Sequelize.STRING(255)},

        username: {type: Sequelize.STRING(100), allowNull: false, unique: true},

        password: {type: Sequelize.STRING(100), allowNull: false},

        email: {type: Sequelize.STRING(100), allowNull: false, unique: true},

        token: {type: Sequelize.STRING(255), unique: true},

        is_admin: {type: Sequelize.SMALLINT, allowNull: false, defaultValue: 0},

        is_active: {type: Sequelize.SMALLINT, allowNull: false, defaultValue: 1},

        created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

        updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    });

module.exports = User
