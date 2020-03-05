const Sequelize = require('sequelize');
const config = require('../config/config');

const mysql = config.mysql

let sql = new Sequelize(mysql.database, mysql.username, mysql.password, {
    host: mysql.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    },
    define: {
        // 字段以下划线（_）来分割（默认是驼峰命名风格）
        'underscored': true
    },
    timezone: '+08:00' //东八时区
});

module.exports = {
    sql,
    Sequelize
}
