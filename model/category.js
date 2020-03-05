/**
 * Category model module.
 * @file 类型数据模型
 * @module model/category
 */


const {sql,Sequelize} = require('./sequelize')

let Category = sql.define('category',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},

        name: {type: Sequelize.STRING(100), allowNull: false},

        key: {type: Sequelize.STRING(100), allowNull: false},

        created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

        updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

        state: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 1}
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    });


module.exports = Category
