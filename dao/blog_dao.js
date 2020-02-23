const {Blog, User, Tag, BlogTag} = require('./model')
const {response} = require('./response')
const {add_tag_intern} = require('./tag_dao')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

function update_blog_attr(req, res, next) {
    let data = req.body
    console.log(data['state'])
    if (data['state'] === undefined)
        update_blog(req, res, next)
    else if (data['state'] == -1)
        remove_blog(req, res, next)
    else if (data['state'] == 1)
        restore_blog(req, res, next)
    else
        response(res, {}, 400)
}

async function add_blog(req, res) {
    let ret_data = {}
    let post_data = req.body
    // console.log(JSON.stringify(post_data))
    let tags = JSON.parse(post_data['tags'])
    // console.log(typeof tags)
    if (!Array.isArray(tags)) {
        tags = [tags]
    }

    let title = post_data['title']
    let content = post_data['content']
    let description = post_data['description']
    let time = new Date()
    let created_at = time
    let updated_at = time
    let state = 1
    let user_id = post_data['user_id']
    try {
        let tag_id_list = []
        for (let tag of tags) {
            let tagQuery = await Tag.findOne({
                where: {
                    name: tag
                }
            })
            if (tagQuery === null) {
                let tagAdd = await add_tag_intern(tag)
                tag_id_list.push(tagAdd.dataValues.id)
                // console.log(tag_id_list)
            }
            else {
                tag_id_list.push(tagQuery.id)
                // console.log(tag_id_list)
            }
        }

        let blog = await Blog.create({
            title, content, description, created_at, updated_at, state, user_id,
        })
        for (let tag_id of tag_id_list) {
            blog.setTags(tag_id)
        }
        // console.log(JSON.stringify(blog))
        ret_data['id'] = blog.id
        response(res, ret_data, 201)
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }

}

async function get_all_blog(req, res) {
    let ret_data = {}
    let currentPage = parseInt(req.query.page) || 1
    let filterTags = req.query.tag || []
    let queryResult = null
    let pageCount = 0
    let sortBy = 'updated_at'
    if (!Array.isArray(filterTags)) {
        filterTags = [filterTags]
    }

    try {
        let countPerPage = 10
        if (currentPage <= 0)
            currentPage = 1
        if (filterTags.length === 0) {
            console.log(countPerPage, countPerPage * (currentPage - 1))
            queryResult = await Blog.findAndCountAll({
                limit: countPerPage, // 每页多少条
                offset: countPerPage * (currentPage - 1), // 跳过多少条
                order: [
                    [sortBy, 'DESC']
                ],
                distinct: true,
                include: [
                    {
                        model: Tag,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        association: Blog.belongsTo(User,
                            {
                                foreignKey: 'user_id',
                            }),
                        attributes: ['avatar', 'username'],
                    },
                ],
                where: {
                    state: 1
                }
            })
        }
        else {
            let result = await BlogTag.findAll({
                where: {
                    tag_id: {
                        [Op.in]: filterTags
                    }
                },
                attributes: ['blog_id'],
                group: 'blog_id'
            })

            let blogList = result.map(i => i.dataValues.blog_id)

            queryResult = await Blog.findAndCountAll({
                distinct: true,
                include: [
                    {
                        model: Tag,
                        attributes: ['id', 'name'],
                        through: {
                            attributes: [],
                        }
                    },
                    {
                        association: Blog.belongsTo(User,
                            {
                                foreignKey: 'user_id',
                            }),
                        attributes: ['avatar', 'username'],
                    },
                ],
                where: {
                    id: {
                        [Op.in]: blogList
                    },
                    state: 1
                },
                limit: countPerPage, // 每页多少条
                offset: countPerPage * (currentPage - 1), // 跳过多少条
                order: [
                    [sortBy, 'DESC']
                ],
            })
        }

        pageCount = Math.ceil(queryResult.count / countPerPage)
        ret_data['data'] = queryResult.rows
        ret_data['total'] = queryResult.count
        ret_data['page'] = currentPage
        ret_data['pageCount'] = pageCount
        response(res, ret_data, 200, 0)
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }
}

async function get_blog_by_id(req, res) {
    let id = req.params.id
    let ret_data = {}
    try {
        let blog = await Blog.findByPk(id)
        if (blog === null) {
            response(res, ret_data, 404)
        }
        else {
            console.log(JSON.stringify(blog))
            ret_data['data'] = blog
            response(res, ret_data, 200, 0)
        }
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }
}

async function get_blogs_by_user_id(req, res) {
    let id = req.params.id
    let ret_data = {}

    let currentPage = parseInt(req.query.page) || 1
    let filterTags = req.query.tag || []
    let queryResult = null
    let pageCount = 0
    let sortBy = 'updated_at'
    if (!Array.isArray(filterTags)) {
        filterTags = [filterTags]
    }
    try {
        let countPerPage = 10
        if (currentPage <= 0)
            currentPage = 1
        if (filterTags.length === 0) {
            queryResult = await Blog.findAndCountAll({
                limit: countPerPage, // 每页多少条
                offset: countPerPage * (currentPage - 1), // 跳过多少条
                order: [
                    [sortBy, 'DESC']
                ],
                distinct: true,
                include: [{
                    model: Tag,
                    attributes: ['id', 'name'],
                    through: {
                        attributes: [],
                    }
                }],
                where: {
                    user_id: id,
                    state: 1
                }
            })
        }
        else {
            let result = await BlogTag.findAll({
                where: {
                    tag_id: {
                        [Op.in]: filterTags
                    }
                },
                attributes: ['blog_id'],
                group: 'blog_id'
            })

            let blogList = result.map(i => i.dataValues.blog_id)

            queryResult = await Blog.findAndCountAll({
                distinct: true,
                include: [{
                    model: Tag,
                    attributes: ['id', 'name'],
                    through: {
                        attributes: [],
                    }
                }],
                where: {
                    id: {
                        [Op.in]: blogList
                    },
                    user_id: id
                },
                limit: countPerPage, // 每页多少条
                offset: countPerPage * (currentPage - 1), // 跳过多少条
                order: [
                    [sortBy, 'DESC']
                ],
            })
        }

        pageCount = Math.ceil(queryResult.count / countPerPage)
        ret_data['data'] = queryResult.rows
        ret_data['total'] = queryResult.count
        ret_data['page'] = currentPage
        ret_data['pageCount'] = pageCount
        response(res, ret_data, 200, 0)
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }
}

async function get_blogs_by_tag_id(req, res) {
    let id = req.params.id
    let ret_data = {}
    try {
        let tag = await Tag.findByPk(id)
        if (tag === null) {
            response(res, ret_data, 404)
        }
        else {
            let blogs = await tag.getBlogs({
                where:{
                    state: 1
                }
            })
            console.log(JSON.stringify(blogs))
            ret_data['data'] = blogs
            response(res, ret_data, 200, 0)
        }
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }
}

async function update_blog(req, res) {
    let ret_data = {}
    let id = req.params.id
    let put_data = req.body
    console.log(JSON.stringify(put_data))

    let title = put_data['title']
    let content = put_data['content']
    let description = put_data['description']
    let created_at = put_data['created_at']
    let updated_at = put_data['created_at']
    let obj = {
        title, content, description, created_at, updated_at
    }
    let result = await update_blog_attrs_by_id(id, obj)
    if (result.status === 1)
        response(res, ret_data, 200, 1)
    else if (result.status === 0)
        response(res, ret_data, 404)
    else
        response(res, ret_data, 400)


}

async function remove_blog(req, res) {
    let ret_data = {}
    let id = req.params.id
    let result = await update_blog_attrs_by_id(id, {'state': -1})
    if (result.status === 1)
        response(res, ret_data, 200, 1)
    else if (result.status === 0)
        response(res, ret_data, 400, 0, 'Fail')
    else
        response(res, ret_data, 404)
}

async function restore_blog(req, res) {
    let ret_data = {}
    let id = req.params.id
    let result = await update_blog_attrs_by_id(id, {'state': 1})
    console.log(result)
    if (result.status === 1)
        response(res, ret_data, 200, 1)
    else if (result.status === 0)
        response(res, ret_data, 400, 0, 'Fail')
    else
        response(res, ret_data, 404)
}

async function update_blog_attrs_by_id(id, obj) {
    let ret = {
        'status': 0,
        'msg': ''
    }
    try {
        let blog = await Blog.findByPk(id)
        if (blog === null) {
            return ret
        }
    }
    catch (err) {
        console.log(err.message)
        ret.status = -1
        return ret

    }

    try {
        let blog = await Blog.update(
            obj,
            {where: {id}}
        )
        console.log(JSON.stringify(blog[0]))
        if (blog[0] > 0) {
            ret.status = 1
            return new Promise((resolve, reject) => {
                resolve(ret)
            })

        }
        else {
            return ret
        }
    }
    catch (err) {
        console.log(err.message)
        ret.status = -1
        return ret
    }
}


module.exports = {
    update_blog_attr,
    add_blog,
    update_blog,
    remove_blog,
    restore_blog,
    get_blog_by_id,
    get_all_blog,
    get_blogs_by_user_id,
    get_blogs_by_tag_id,

}
