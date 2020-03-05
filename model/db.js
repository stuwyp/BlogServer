const {sql} = require('./sequelize')

const {Blog, BlogTag, BlogLike} = require('./blog')
const User = require('./user')
const Comment = require('./comment')
const Tag = require('./tag')
const Category = require('./category')


// Blog.sync({ alter: true })
// sql.sync()

sql.authenticate()
    .then(async () => {
        console.log('Connection has been established successfully.');

        User.hasMany(Blog, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE'})
        User.hasMany(Comment, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE'})
        User.hasMany(BlogLike, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE'})

        Blog.hasMany(Comment, {foreignKey: {name: 'blog_id', allowNull: false}, onDelete: 'CASCADE'})
        Blog.hasMany(BlogLike, {foreignKey: {name: 'blog_id', allowNull: false}, onDelete: 'CASCADE'})

        Category.hasMany(Blog, {foreignKey: {name: 'category_id', allowNull: false}, onDelete: 'CASCADE'})

        Tag.belongsToMany(Blog, {through: 'blog_tag', foreignKey: {name: 'blog_id',allowNull: false}});
        Blog.belongsToMany(Tag, {through: 'blog_tag', foreignKey: {name: 'tag_id',allowNull: false}});

        // // User的实例对象将拥有：getNotes、setNotes、addNote、createNote、
        // // removeNote、hasNote方法
        // User.hasMany(Note);
        // // Note的实例对象将拥有getUser、setUser、createUser方法
        // Note.belongsTo(User);

        sql.sync({
            // force: true
        }).then(async () => {
            console.log('tables created!');
        })
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {
    Blog,
    User,
    Comment,
    Tag,
    Category,
    BlogTag,
    BlogLike
}
