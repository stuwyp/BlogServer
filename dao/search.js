const {Blog, User} = require('./model')
const {response} = require('./response')
const Sequelize = require('sequelize');
const Op = Sequelize.Op

async function globalSearchBlogs(req, res) {
    let keyword = req.query.key;
    let currentPage = parseInt(req.query.page) || 1
    let ret_data = {};
    let pageCount = 0
    let sortBy = 'updated_at'

    try {
        let countPerPage = 10
        if (currentPage <= 0)
            currentPage = 1
        let queryResult = await Blog.findAndCountAll({
            where: {
                [Op.or]: {
                    content: {
                        [Op.like]: '%' + keyword + '%'
                    },
                    title: {
                        [Op.like]: '%' + keyword + '%'
                    },
                    description: {
                        [Op.like]: '%' + keyword + '%'
                    },
                }
            },
            limit: countPerPage, // 每页多少条
            offset: countPerPage * (currentPage - 1), // 跳过多少条
            order: [
                [sortBy, 'DESC']
            ],
        })

        if (queryResult === null) {
            response(res, ret_data, 404);
        }
        else {
            ret_data['data'] = queryResult.rows
            ret_data['total'] = queryResult.count
            ret_data['page'] = currentPage
            ret_data['pageCount'] = pageCount
            response(res, ret_data, 200, 0);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

module.exports = {
    globalSearchBlogs,

}
