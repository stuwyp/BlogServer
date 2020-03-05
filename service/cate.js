const {Category, User} = require('../model/db')
const {response} = require('./response')

async function add_cate_intern(name) {

    let state = 1;
    let time = new Date();
    let created_at = time
    let updated_at = time

    return await Category.create({
        name, state, created_at, updated_at,
    })

}

async function add_cate(req, res) {
    let ret_data = {};

    let {name, state} = req.body;
    state = state || 1;

    let time = new Date();
    let created_at = time
    let updated_at = time

    try {
        let cate = await Category.create({
            name, state, created_at, updated_at,
        })
        // console.log(JSON.stringify(cate))
        ret_data['id'] = cate.id;
        response(res, ret_data, 201);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }

}

async function delete_cate(req, res) {
    let ret_data = {};
    let id = req.params.id;
    if (id) {
        try {
            let cate = await Category.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
            console.log(JSON.stringify(cate))
            if (cate > 0) {
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

async function update_cate(req, res) {
    let ret_data = {};
    let id = req.params.id;
    try {
        let cate = await Category.findByPk(id)
        if (cate === null) {
            response(res, ret_data, 404);
            return
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
        return
    }

    let {name, state} = req.body

    let time = new Date();
    let updated_at = time
    try {
        let cate = await Category.update(
            {name, state, updated_at},
            {
                where: {
                    id: id
                }
            })
        // console.log(JSON.stringify(cate[0]))
        if (cate[0] > 0) {
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

async function get_cate_by_id(req, res) {
    let id = req.params.id;
    let ret_data = {};
    try {
        let cate = await Category.findByPk(id)
        if (cate === null) {
            response(res, ret_data, 404);
        }
        else {
            // console.log(JSON.stringify(cate))
            ret_data['data'] = cate;
            response(res, ret_data, 200, 0);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_all_cate(req, res) {
    let ret_data = {};
    try {

        let queryResult = await Category.findAndCountAll()

        ret_data['data'] = queryResult.rows
        ret_data['total'] = queryResult.count

        response(res, ret_data, 200, 0);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}


module.exports = {
    add_cate,
    update_cate,
    delete_cate,
    get_cate_by_id,
    get_all_cate,
    add_cate_intern
};
