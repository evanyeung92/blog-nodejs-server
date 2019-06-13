const { getList, getBlogDetail, createNewBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModal } = require('../model/resModel')

const handleBlogRouter = (req, res) =>{
    const method = req.method
    const id = req.query.id

    if(method === 'GET' && req.path === '/api/blog/list'){
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''

        const result = getList(author, keyword)
        return result.then(listData=>{
            return new SuccessModel(listData)
        })
    }
    if(method === 'GET' && req.path === '/api/blog/detail'){
        const result = getBlogDetail(id)
        return result.then(data =>{
            return new SuccessModel(data)
        })
    }
    if(method === 'POST' && req.path === '/api/blog/new'){
        req.body.author = 'zhangsan'
        const result = createNewBlog(req.body)
        return result.then(data =>{
            return new SuccessModel(data)
        })
    }
    if(method === 'POST' && req.path === '/api/blog/update'){
        const result = updateBlog(id, req.body)
        return result.then(value =>{
            if(value){
                return new SuccessModel()
            } else{
                return new ErrorModal("更新博客失败")
            }
        })

    }
    if(method === 'POST' && req.path === '/api/blog/delete'){
        const author = 'zhangsan'
        const result = deleteBlog(id, author)
        return result.then(value =>{
            if(value){
                return new SuccessModel()
            } else{
                return new ErrorModal("删除博客失败")
            }
        })
    }
}

module.exports = handleBlogRouter