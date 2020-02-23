const {sql} = require('./sequelize')

const {Blog, BlogTag, BlogLike}= require('./blog')
const User = require('./user')
const Comment = require('./comment')
const Tag = require('./tag')
const Category = require('./category')

User.hasMany(Blog, {foreignKey: 'user_id', onDelete: 'CASCADE'})
User.hasMany(Comment, {foreignKey: 'user_id', onDelete: 'CASCADE'})
User.hasMany(BlogLike, {foreignKey: 'user_id', onDelete: 'CASCADE'})

Blog.hasMany(Comment, {foreignKey: 'blog_id', onDelete: 'CASCADE'})
Blog.hasMany(BlogLike, {foreignKey: 'blog_id', onDelete: 'CASCADE'})


Category.hasMany(Blog, {foreignKey: 'category_id', onDelete: 'CASCADE'})

Tag.belongsToMany(Blog, {through: 'blog_tag'});
Blog.belongsToMany(Tag, {through: 'blog_tag'});

sql.sync()

module.exports = {
    Blog,
    User,
    Comment,
    Tag,
    Category,
    BlogTag,
    BlogLike
}
