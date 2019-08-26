const config = require('./config.js');
const Sequelize = require('sequelize');

let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
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
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        content: Sequelize.TEXT,
        description: Sequelize.STRING(255),
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        state: Sequelize.SMALLINT
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    });


let User = sequelize.define('user',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: Sequelize.STRING(100),
        password: Sequelize.STRING(100),
        email: Sequelize.STRING(100),
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        is_admin: Sequelize.SMALLINT,
        is_active: Sequelize.SMALLINT
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    });


let Comment = sequelize.define('comment',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: Sequelize.STRING(100),
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        state: Sequelize.SMALLINT
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    });


let Tag = sequelize.define('tag',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: Sequelize.STRING(100),
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        state: Sequelize.SMALLINT
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    });


let Category = sequelize.define('category',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: Sequelize.STRING(100),
        key: Sequelize.STRING(100),
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        state: Sequelize.SMALLINT
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    });

let BlogTag = sequelize.define('blog_tag',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    })

let BlogCategory = sequelize.define('blog_category',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    })

User.hasMany(Blog, {foreignKey: 'user_id', onDelete: 'CASCADE'})
Blog.hasMany(Comment, {foreignKey: 'blog_id', onDelete: 'CASCADE'})

Tag.belongsToMany(Blog, {through: 'blog_tag'});
Blog.belongsToMany(Tag, {through: 'blog_tag'});

Category.belongsToMany(Blog, {through: 'blog_category'});
Blog.belongsToMany(Category, {through: 'blog_category'});

sequelize.sync()

module.exports = {
    Blog,
    User,
    Comment,
    Tag,
    Category,
    BlogCategory,
    BlogTag
}
