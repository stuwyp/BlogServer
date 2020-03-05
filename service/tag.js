const {Tag, User} = require('../model/db')
const {response} = require('./response')

async function add_tag_intern(name) {

    let state = 1;
    let time = new Date();
    let created_at = time
    let updated_at = time

    return await Tag.create({
        name, state, created_at, updated_at,
    })

}

async function add_tag(req, res) {
    let ret_data = {};

    let {name, state} = req.body;
    state = state || 1;

    let time = new Date();
    let created_at = time
    let updated_at = time

    try {
        let tag = await Tag.create({
            name, state, created_at, updated_at,
        })
        // console.log(JSON.stringify(tag))
        ret_data['id'] = tag.id;
        response(res, ret_data, 201);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }

}

async function delete_tag(req, res) {
    let ret_data = {};
    let id = req.params.id;
    if (id) {
        try {
            let tag = await Tag.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
            console.log(JSON.stringify(tag))
            if (tag > 0) {
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

async function update_tag(req, res) {
    let ret_data = {};
    let id = req.params.id;
    try {
        let tag = await Tag.findByPk(id)
        if (tag === null) {
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
        let tag = await Tag.update(
            {name, state, updated_at},
            {
                where: {
                    id: id
                }
            })
        // console.log(JSON.stringify(tag[0]))
        if (tag[0] > 0) {
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

async function get_tag_by_id(req, res) {
    let id = req.params.id;
    let ret_data = {};
    try {
        let tag = await Tag.findByPk(id)
        if (tag === null) {
            response(res, ret_data, 404);
        }
        else {
            // console.log(JSON.stringify(tag))
            ret_data['data'] = tag;
            response(res, ret_data, 200, 0);
        }
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }
}

async function get_all_tag(req, res) {
    let ret_data = {};
    try {

        let queryResult = await Tag.findAndCountAll()

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
    add_tag,
    update_tag,
    delete_tag,
    get_tag_by_id,
    get_all_tag,
    add_tag_intern
};
