const {User} = require('../model/model')
const {response} = require('./response')
const jwt = require('jsonwebtoken')
const {security} = require('../config/config')


async function get_info(req, res) {
    let ret_data = {}
    let username = ''
    let token = req.headers['authorization'].slice(7)
    console.log(token)
    jwt.verify(token, security.secretKey, function (err, decoded) {
        if (err) {
            console.log(err)
            response(res, ret_data, 401)
        }
        console.log(decoded)
        username = decoded.username
    })

    try {
        let user = await User.findOne({
            where: {
                username: username
            }
        })
        if (user) {
            ret_data['data'] = {
                // 'avatar':user.avatar,
                'id': user.id,
                'username': user.username,
                'updated_at': user.updated_at
            }
            ret_data['isLogin'] = true
            response(res, ret_data, 200)
        }
        else {
            response(res, ret_data, 404)
        }
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 404)
    }

}

async function add_user(req, res) {
    let ret_data = {}
    let post_data = req.body
    console.log(JSON.stringify(post_data))
    let username = post_data['username']
    let password = post_data['password']
    let email = post_data['email']
    let time = new Date();
    let created_at = time
    let updated_at = time
    let is_admin = 0
    let is_active = 1

    try {

        let encryptPass = security.md5(password)
        let token = null

        let user = await User.create({
            username, password: encryptPass, email, token, created_at, updated_at, is_admin, is_active
        })
        console.log(JSON.stringify(user))
        ret_data['id'] = user.id
        response(res, ret_data, 201)
        console.log('ok')

    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }


}

async function update_user(req, res) {
    let ret_data = {}
    let user_id = req.params.id
    try {
        let user = await User.findByPk(user_id)
        if (user === null) {
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
    let username = put_data['username']
    let password = put_data['password']
    let email = put_data['email']
    let token = 1
    let created_at = put_data['created_at']
    let updated_at = put_data['created_at']
    let is_admin = 1
    let is_active = 1
    let encryptPass = md5.update(password).digest("hex")
    try {
        let user = await User.update(
            {
                username, password: encryptPass, email, token, created_at, updated_at, is_admin, is_active, user_id,
            },
            {
                where: {
                    id: user_id
                }
            })
        console.log(JSON.stringify(user[0]))
        if (user[0] > 0) {
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

async function get_user_by_id(req, res) {
    let id = req.params.id
    let ret_data = {}
    try {
        let user = await User.findByPk(id)
        if (user === null) {
            response(res, ret_data, 404)
        }
        else {
            console.log(JSON.stringify(user))
            ret_data['data'] = user
            response(res, ret_data, 200, 0)
        }
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }
}

async function get_all_user(req, res) {
    let ret_data = {}

    try {
        let user = await User.findAll()
        // console.log(JSON.stringify(user))
        ret_data['data'] = user
        ret_data['total'] = user.length
        ret_data['page'] = 1
        response(res, ret_data, 200, 0)
    }
    catch (err) {
        console.log(err.message)
        response(res, ret_data, 400)
    }
}

async function user_login(req, res) {
    let ret_data = {}
    let data = req.body
    if (data) {
        try {
            console.log(data)
            let user = await User.findOne(
                {
                    where: {
                        username: data.username,
                        password: security.md5(data.password)
                    }
                }
            )
            console.log("data : ", JSON.stringify(user))
            if (user) {
                let token = jwt.sign({username: user.username}, security.secretKey, {
                    expiresIn: 60 * 60 // 授权时效
                })
                user.token = token
                await user.save()
                ret_data['token'] = token
                ret_data['data'] = {
                    // 'avatar':user.avatar,
                    'id': user.id,
                    'username': user.username,
                    'updated_at': user.updated_at
                }
                ret_data['isLogin'] = true
                response(res, ret_data, 200, 2)
            }
            else {
                response(res, ret_data, 401)
            }
        }
        catch
            (err) {
            console.log(err.message)
            response(res, ret_data, 400)
        }
    }
    else {
        response(res, ret_data, 400)
    }
}

async function delete_user(req, res) {
    let ret_data = {}
    let id = req.params.id
    if (id) {
        try {
            let user = await User.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
            console.log(JSON.stringify(user))
            if (user > 0) {
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

module.exports = {
    add_user,
    update_user,
    get_user_by_id,
    get_all_user,
    user_login,
    get_info
}
