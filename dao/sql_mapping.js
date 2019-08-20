// CRUD SQL语句
let user = {
    insert: 'insert into user(id,username,password,email,created_at,updated_at,is_admin,is_active) values(0,?,?,?,?,?,?,?);',
    update: 'update user set username = ?,password = ?,email = ?,created_at = ?,updated_at = ?,is_admin=?,is_active=? where id=?;',
    delete: 'delete from user where id=?;',
    query_by_id: 'select * from user where id=?;',
    query_all: 'select * from user;'
};

let blog = {
    insert: 'insert into blog(id,title,author,content,description,category_id,created_at,updated_at,state) values(0,?,?,?,?,?,?,?,?);',
    update: 'update blog set title = ?,author = ?,content = ?,description = ?,category_id = ?,created_at = ?,updated_at = ? where id=?;',
    delete: 'delete from blog where id=?;',
    query_by_id: 'select * from blog where id=?;',
    query_all: 'select * from blog;'
};

module.exports = {
    user,
    blog,
}
