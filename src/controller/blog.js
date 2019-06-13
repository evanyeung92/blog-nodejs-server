const fs = require('fs')
const path = require('path')
const { exec } = require('../db/mysql')

const getList = (author, keyword) =>{
    let sql = `select id, title, content, author, createtime from blogs where 1=1 `
    if(author){
        sql+= `and author='${author}' `
    }
    if(keyword){
        sql+= `and title like '%${keyword}%' `
    }

    sql += `order by createtime desc;`

    return exec(sql)
}

const getBlogDetail = (id) =>{
    const sql = `select * from blogs where id =${id}`
    return exec(sql).then(rows=>{
        return rows[0]
    })
}

const createNewBlog = (blogData = {}) =>{
    const title = blogData.title;
    const content = blogData.content;
    const author = blogData.author;
    const createTime = Date.now()
    const sql = `insert into blogs (title, content, createtime, author)values ('${title}','${content}',${createTime},'${author}'); `
    return exec(sql).then(insertData =>{
        console.log('Created successfully',insertData)
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) =>{
    const title = blogData.title;
    const content = blogData.content;
    const sql = `update blogs set title='${title}',content='${content}' where id=${id}`
    return exec(sql).then(updatedData =>{
        console.log('updated successfully',updatedData)
        if(updatedData.affectedRows > 0){
            return true
        }
        return false
    })
}

const deleteBlog = (id, author) =>{
    const sql = `delete from blogs where id='${id}' and author='${author}'`
    return exec(sql).then(deletedData =>{
        console.log('deleted successfully',deletedData)
        if(deletedData.affectedRows > 0){
            return true
        }
        return false
    })
}

// const getFileContent = (fileName) => {
//     const promise = new Promise((resolve, reject) => {
//         const fullFileName = path.resolve(__dirname, 'files', fileName)
//         fs.readFile(fullFileName, (err, data) => {
//             if (err) {
//                 reject(err)
//                 return
//             }
//             resolve(
//                 JSON.parse(data.toString())
//             )
//         })
//     })
//     return promise
// }    

module.exports = {
    getList,
    getBlogDetail,
    createNewBlog,
    updateBlog,
    deleteBlog
}