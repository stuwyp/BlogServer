const {BlogTag} = require('./model')

async function add_blog_tag(tag_id, blog_id) {
    console.log(tag_id, blog_id)
    return await BlogTag.create({
        blog_id: blog_id,
        tag_id: tag_id
    })

}

async function delete_blog_tag(id) {
    return await BlogTag.destroy(
        {
            where: {
                id: id
            }
        }
    )

}

module.exports = {
    add_blog_tag,
    delete_blog_tag,
};
