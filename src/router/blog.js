const { getList, getBlogDetail, createNewBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModal } = require('../model/resModel')

//登陆验证方法
const  loginCheck = (req) =>{
    if (!req.session.username) {
        return Promise.resolve(new ErrorModal("尚未登陆"))  
    } 
}

const handleBlogRouter = (req, res) =>{
    const method = req.method
    const id = req.query.id

    if(method === 'GET' && req.path === '/api/blog/list'){
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        //识别admin
        if(req.query.isAdmin){
            const loginCheckResult = loginCheck(req)
            if(loginCheckResult){
                return loginCheckResult
            }   
            author = req.session.username
        }

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
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            //未登录
            return loginCheckResult
        }
        req.body.author = req.session.username
        const result = createNewBlog(req.body)
        return result.then(data =>{
            return new SuccessModel(data)
        })
    }
    if(method === 'POST' && req.path === '/api/blog/update'){
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            //未登录
            return loginCheckResult
        }
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
        if(loginCheckResult){
            //未登录
            return loginCheckResult
        }
        const author = req.session.username
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