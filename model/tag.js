/**
 * Tag model module.
 * @file 标签数据模型
 * @module model/tag
 */

const {sql,Sequelize} = require('./sequelize')


let Tag = sql.define('tag',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},

        name: {type: Sequelize.STRING(100), allowNull: false, unique: true},

        state: {type: Sequelize.SMALLINT, allowNull: false, defaultValue: 1},

        created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

        updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    });


module.exports = Tag
