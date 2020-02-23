const {Blog, Tag} = require('../model/model')
const {response} = require('./response')


async function delete_blog(req, res) {
    let ret_data = {};
    let id = req.params.id;
    if (id) {
        try {
            let blog = await Blog.destroy(
                {where: {id}}
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

async function get_blogs_by_user_id(req, res) {
    let id = req.params.id;
    let ret_data = {};
    let currentPage = parseInt(req.query.page) || 1
    let queryResult = null
    let pageCount = 0
    let sortBy = 'updated_at'

    try {
        let countPerPage = 10
        if (currentPage <= 0)
            currentPage = 1

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
                state: -1
            }
        })


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


module.exports = {
    delete_blog,
    get_blogs_by_user_id
};
