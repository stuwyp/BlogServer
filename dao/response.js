response = (res, ret_data, code, kind,msg) => {
    switch (code) {
        case 404:
            ret_data['code'] = 40004
            ret_data['errMsg'] = 'Not found';
            break;
        case 401:
            ret_data['code'] =40001
            ret_data['errMsg'] = 'login failed';
            break;
        case 400:
            ret_data['code'] = 40000
            ret_data['errMsg'] = msg ||'Request error';
            break;
        case 201:
            ret_data['code'] = 20001
            ret_data['status'] = 'created';
            break;
        case 200:

            if (kind === 1) {
                ret_data['code'] = 20002
                ret_data['status'] = 'updated';
            }
            else if (kind === -1) {
                ret_data['code'] = 20003
                ret_data ['status'] = 'deleted';
            }
            else if (kind === 2) {
                ret_data['code'] = 20001
                ret_data ['status'] = 'login success';
            }
            break;
    }
    // res.status(code).send(JSON.stringify(ret_data))
    res.writeHead(code, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(ret_data));
};

module.exports = {response}
