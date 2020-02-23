const {Comment, Blog, User} = require('../model/model')
const {response} = require('./response')


async function add_comment(req, res) {
    let ret_data = {}
    let post_data = req.body
    let content = post_data['content']
    let blog_id = post_data['blog_id']
    let user_id = post_data['user_id']
    let state = 1
    let time = new Date()
    let created_at = time
    let updated_at = time
    console.log(content,
        created_at,
        updated_at,
        state,
        blog_id,
        user_id)
    try {
        let comment = await Comment.create({
            content,
            created_at,
            updated_at,
            state,
            blog_id,
            user_id
        })
        console.log(JSON.stringify(comment))
        ret_data['id'] = comment.id
        response(res, ret_data, 201)
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }

}

async function delete_comment(req, res) {
    let ret_data = {}
    let id = req.params.id
    if (id) {
        try {
            let comment = await Comment.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
            console.log(JSON.stringify(comment))
            if (comment > 0) {
                response(res, ret_data, 200, -1)
            }
            else {
                response(res, ret_data, 404)
            }
        }
        catch (err) {
            console.log(err.message)
            response(res, ret_data, 400)
        }
    }
    else {
        response(res, ret_data, 400)
    }
}

async function update_comment(req, res) {
    let ret_data = {}
    let id = req.params.id
    try {
        let comment = await Comment.findByPk(id)
        if (comment === null) {
            response(res, ret_data, 404)
            return
        }
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
        return
    }

    let put_data = req.body
    console.log(JSON.stringify(put_data))
    let content = put_data['content']
    let created_at = put_data['created_at']
    let updated_at = put_data['created_at']
    let state = 1
    let blog_id = put_data['blog_id']
    let user_id = put_data['user_id']

    try {
        let comment = await Comment.update(
            {
                content,
                created_at,
                updated_at,
                state,
                blog_id,
                user_id,
            },
            {
                where: {
                    id: id
                }
            })
        console.log(JSON.stringify(comment[0]))
        if (comment[0] > 0) {
            response(res, ret_data, 200, 1)
        }
        else {
            response(res, ret_data, 400)
        }
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }

}

async function get_comment_by_id(req, res) {
    let id = req.params.id
    let ret_data = {}
    try {
        let comment = await Comment.findByPk(id)
        if (comment === null) {
            response(res, ret_data, 404)
        }
        else {
            console.log(JSON.stringify(comment))
            ret_data['data'] = comment
            response(res, ret_data, 200, 0)
        }
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }
}

async function get_all_comment(req, res) {
    let ret_data = {}

    try {
        let comment = await Comment.findAll()
        // console.log(JSON.stringify(comment))
        ret_data['data'] = comment
        ret_data['total'] = comment.length
        ret_data['page'] = 1
        response(res, ret_data, 200, 0)
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }
}

async function get_comments_by_user_id(req, res) {
    let id = req.params.id
    let ret_data = {}
    try {
        let user = await User.findByPk(id)
        if (user === null) {
            response(res, ret_data, 404)
        }
        else {
            let comments = await user.getComments()
            console.log(JSON.stringify(comments))
            ret_data['data'] = comments
            response(res, ret_data, 200, 0)
        }
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }
}

async function get_comments_by_blog_id(req, res) {
    let id = req.params.id
    let currentPage = parseInt(req.query.page) || 1
    let ret_data = {}
    try {
        let blog = await Blog.findByPk(id)
        if (blog === null) {
            response(res, ret_data, 404)
        }
        else {
            let include = [{
                association: Comment.belongsTo(User,
                    {
                        foreignKey: 'user_id',
                    }),
                attributes: ['id', 'username'],
            }]
            let countPerPage = 10
            let queryTotal = await blog.getComments()
            if (queryTotal.length > 0) {
                let pageCount = Math.ceil(queryTotal.length / countPerPage)
                if (currentPage > pageCount)
                    currentPage = pageCount
                else if (currentPage <= 0)
                    currentPage = 1
                let comments = await blog.getComments({
                    attributes: ['id', 'content', 'created_at', 'updated_at', 'state'],
                    distinct: true,
                    include: include,
                    limit: countPerPage, // 每页多少条
                    offset: countPerPage * (currentPage - 1), // 跳过多少条
                    order: [
                        ['updated_at', 'DESC']
                    ]
                })
                ret_data['data'] = {
                    'list': comments,
                    'pageCount': pageCount,
                    'total': queryTotal.length,
                    'page': currentPage
                }
            }
            else {
                ret_data['data'] = {
                    'list': [],
                    'pageCount': 0,
                    'total': 0,
                    'page': 1
                }
            }


            response(res, ret_data, 200, 0)
        }
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }
}


module.exports = {
    add_comment,
    update_comment,
    delete_comment,
    get_comment_by_id,
    get_all_comment,
    get_comments_by_user_id,
    get_comments_by_blog_id
}
