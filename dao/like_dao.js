const {BlogLike, User} = require('../model/model')
const {response} = require('./response')

async function add_like(req, res) {
    let ret_data = {};
    let post_data = req.body;
    let name = post_data['name'];
    let state = post_data['state'] || 1;
    let time = new Date();
    let created_at = time
    let updated_at = time

    try {
        let like = await Like.create({
            name, state, created_at, updated_at,
        })
        console.log(JSON.stringify(like))
        ret_data['id'] = like.id;
        response(res, ret_data, 201);
    }
    catch (err) {
        console.log(err.message);
        response(res, ret_data, 400);
    }

}

async function delete_like(req, res) {
    let ret_data = {};
    let id = req.params.id;
    if (id) {
        try {
            let like = await Like.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
            console.log(JSON.stringify(like))
            if (like > 0) {
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


module.exports = {
    add_like,
    delete_like,
};
