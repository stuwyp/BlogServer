/**
 * Comment model module.
 * @file 评论数据模型
 * @module model/comment
 */

const {sql,Sequelize} = require('./sequelize')

// 评论模型
let Comment = sql.define('comment',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},

        content: {type: Sequelize.STRING(100), allowNull: false},

        // 状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论
        state: {type: Sequelize.SMALLINT, allowNull: false, defaultValue: 1},

        is_top: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},

        created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

        updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    });

module.exports = Comment
