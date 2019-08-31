const {Blog, User, Tag, BlogTag} = require('./model')
const {response} = require('./response')
const {add_tag_intern} = require('./tag_dao')
const Sequelize = require('sequelize');
const Op = Sequelize.Op

async function add_blog(req, res) {
    let ret_data = {};
    let post_data = req.body;
    // console.log(JSON.stringify(post_data));
    let tags = JSON.parse(post_data['tags'])
    // console.log(typeof tags)
    if (!Array.isArray(tags)) {
        tags = [tags]
    }

    let title = post_data['title'];
    let content = post_data['content'];
    let description = post_data['description'];
    let time = new Date();
    let created_at = time
    let updated_at = time
    let state = 1
    let user_id = post_data['user_id'];
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
        ret_data['id'] = blog.id;
        response(res, ret_data, 201);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }

}

async function delete_blog(req, res) {
    let ret_data = {};
    let id = req.params.id;
    if (id) {
        try {
            let blog = await Blog.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
            console.log(JSON.stringify(blog))
            if (blog > 0) {
                response(res, ret_data, 200, -1);
            }
            else {
                response(res, ret_data, 404);
            }
        }
        catch (err) {
            console.log(err.message);
            response(res, ret_data, 400);
        }
    }
    else {
        response(res, ret_data, 400);
    }
}

async function update_blog(req, res) {
    let ret_data = {};
    let id = req.params.id;
    try {
        let blog = await Blog.findByPk(id)
        if (blog === null) {
            response(res, ret_data, 404);
            return
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
        return
    }


    let put_data = req.body
    console.log(JSON.stringify(put_data));
    let title = put_data['title'];
    let content = put_data['content'];
    let description = put_data['description'];
    // let category_id = 1;
    let created_at = put_data['created_at'];
    let updated_at = put_data['created_at'];
    let state = 1
    let user_id = put_data['user_id'];
    try {
        let blog = await Blog.update(
            {
                title: title,
                content: content,
                description: description,
                created_at: created_at,
                updated_at: updated_at,
                state: state,
                user_id: user_id,
            },
            {
                where: {
                    id: id
                }
            })
        console.log(JSON.stringify(blog[0]))
        if (blog[0] > 0) {
            response(res, ret_data, 200, 1);
        }
        else {
            response(res, ret_data, 400);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }

}

async function get_all_blog(req, res) {
    let ret_data = {};
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
            console.log(countPerPage,countPerPage*(currentPage-1))
            queryResult = await Blog.findAndCountAll({
                limit: countPerPage, // 每页多少条
                offset: countPerPage * (currentPage - 1), // 跳过多少条
                order: [
                    [sortBy, 'DESC']
                ],
                distinct:true,
                include: [{
                    model: Tag,
                    attributes: ['id', 'name'],
                    through: {
                        attributes: [],
                    },
                }],
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
                    }
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
        response(res, ret_data, 200, 0);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_blog_by_id(req, res) {
    let id = req.params.id;
    let ret_data = {};
    try {
        let blog = await Blog.findByPk(id)
        if (blog === null) {
            response(res, ret_data, 404);
        }
        else {
            console.log(JSON.stringify(blog))
            ret_data['data'] = blog;
            response(res, ret_data, 200, 0);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_blogs_by_user_id(req, res) {
    let id = req.params.id;
    let ret_data = {};

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
                distinct:true,
                include: [{
                    model: Tag,
                    attributes: ['id', 'name'],
                    through: {
                        attributes: [],
                    }
                }],
                where: {
                    user_id: id
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
        ret_data['total'] = queryResult.count - 1
        ret_data['page'] = currentPage
        ret_data['pageCount'] = pageCount
        response(res, ret_data, 200, 0);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_blogs_by_tag_id(req, res) {
    let id = req.params.id;
    let ret_data = {};
    try {
        let tag = await Tag.findByPk(id)
        if (tag === null) {
            response(res, ret_data, 404);
        }
        else {
            let blogs = await tag.getBlogs()
            console.log(JSON.stringify(blogs))
            ret_data['data'] = blogs;
            response(res, ret_data, 200, 0);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

module.exports = {
    add_blog,
    update_blog,
    delete_blog,
    get_blog_by_id,
    get_all_blog,
    get_blogs_by_user_id,
    get_blogs_by_tag_id
};
