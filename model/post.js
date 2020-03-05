/**
 * Blog model module.
 * @file 博客文章 数据模型
 * @module model/blog
 */

const {sql,Sequelize} = require('./sequelize')

// 博客模型
let Blog = sql.define('blog',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},

        title: {type: Sequelize.STRING(100), allowNull: false},

        content: {type: Sequelize.TEXT, allowNull: false},

        desc: {type: Sequelize.STRING(255), allowNull: true},

        // // 文章发布状态 => 0 草稿，1 已发布  -1 已删除
        state: {type: Sequelize.SMALLINT, allowNull: false, defaultValue: 0},

        // 文章转载状态 => 0 原创，1 转载，2 混合
        origin: { type: Sequelize.SMALLINT, allowNull: false, defaultValue: 0},

        created_at: {type: Sequelize.DATE, allowNull: false},

        updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

        uuid: {type: Sequelize.STRING(100), allowNull: false, unique: true},
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    });

// 点赞模型
let BlogLike = sql.define('blog_like',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},

        created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    });

let BlogTag = sql.define('blog_tag',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    });

module.exports = {
    Blog,
    BlogLike,
    BlogTag
}
