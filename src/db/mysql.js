const mysql = require('mysql')
const { MYSQL_CONFIG } = require('../config/db')

const con = mysql.createConnection(MYSQL_CONFIG)

con.connect()

function exec(sql){
    const promise = new Promise((resolve, reject)=>{
        con.query(sql, (err, result)=>{
            if(err){
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise 
}

module.exports = {
    exec
}
