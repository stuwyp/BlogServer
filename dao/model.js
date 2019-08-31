const config = require('../config/config');
const Sequelize = require('sequelize');
const mysql = config.mysql
let sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, {
    host: mysql.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    },
    define: {
        // 字段以下划线（_）来分割（默认是驼峰命名风格）
        'underscored': true
    }

});

let Blog = sequelize.define('blog',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        title: {type: Sequelize.STRING(100), allowNull: false},
        content: {type: Sequelize.TEXT, allowNull: false},
        description: {type: Sequelize.STRING(255), allowNull: true},
        state: {type: Sequelize.SMALLINT, allowNull: false, defaultValue: 1},
        created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
        updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
    },
    {timestamps: false, freezeTableName: true, underscored: true});


let User = sequelize.define('user',
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
    {timestamps: false, freezeTableName: true, underscored: true});


let Comment = sequelize.define('comment',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        content: {type: Sequelize.STRING(100), allowNull: false},
        state: {type: Sequelize.SMALLINT, allowNull: false, defaultValue: 1},
        created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
        updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

    },
    {timestamps: false, freezeTableName: true, underscored: true});


let Tag = sequelize.define('tag',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING(100), allowNull: false, unique: true},
        state: {type: Sequelize.SMALLINT, allowNull: false, defaultValue: 1},
        created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
        updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
    },
    {timestamps: false, freezeTableName: true, underscored: true});


let Category = sequelize.define('category',
    {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING(100), allowNull: false},
        key: {type: Sequelize.STRING(100), allowNull: false},
        created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
        updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
        state: Sequelize.SMALLINT
    },
    {timestamps: false, freezeTableName: true, underscored: true});


let BlogTag = sequelize.define('blog_tag',
    {id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},},
    {timestamps: false, freezeTableName: true, underscored: true});




User.hasMany(Blog, {foreignKey: 'user_id', onDelete: 'CASCADE'})
User.hasMany(Comment, {foreignKey: 'user_id', onDelete: 'CASCADE'})
Blog.hasMany(Comment, {foreignKey: 'blog_id', onDelete: 'CASCADE'})
Category.hasMany(Blog,{foreignKey: 'category_id', onDelete: 'CASCADE'})

Tag.belongsToMany(Blog, {through: 'blog_tag'});
Blog.belongsToMany(Tag, {through: 'blog_tag'});



sequelize.sync()

module.exports = {
    Blog,
    User,
    Comment,
    Tag,
    Category,
    BlogTag,
}
