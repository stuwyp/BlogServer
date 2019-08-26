response = (res, ret_data, code, kind) => {
    switch (code) {
        case 404:
            ret_data['errMsg'] = 'Not found';
            break;
        case 400:
            ret_data['errMsg'] = 'Request error';
            break;
        case 201:
            ret_data['status'] = 'created';
            break;
        case 200:
            if (kind === 1)
                ret_data['status'] = 'updated';
            else if (kind === -1)
                ret_data ['status'] = 'deleted';
            break;
    }
    res.writeHead(code, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(ret_data));
};

module.exports  = {response}
