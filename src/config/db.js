
const env = process.env.NODE_ENV

let MYSQL_CONFIG = {}
if(env === 'dev'){
    MYSQL_CONFIG = {
        host:'localhost',
        user:'root',
        password:'admin',
        port:'3306',
        database:'blog'
    }
}

if(env === 'production'){
    MYSQL_CONFIG = {
        host:'localhost',
        user:'root',
        password:'admin',
        port:'3306',
        database:'blog'
    }
}

module.exports = {
    MYSQL_CONFIG
}