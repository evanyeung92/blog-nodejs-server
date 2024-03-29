const { login } = require('../controller/user')
const { SuccessModel, ErrorModal } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) =>{
    const method = req.method
    //login
    if(method === 'POST' && req.path === '/api/user/login'){
        const { username, password } = req.body
        const result = login(username, password)
        return result.then(data =>{
            if(data.username){
                req.session.username = data.username
                req.session.realname = data.realname
                set(req.sessionId, req.session)
               
                return new SuccessModel()
            } else{
                return new ErrorModal("登陆失败")
            }
        })
    }

    // if(method === 'GET' && req.path === '/api/user/login-test'){
    //     if (req.session.username) {
    //         return Promise.resolve(new SuccessModel({
    //             session: req.session
    //         }))
    //     }
    //     return Promise.resolve(new ErrorModal("尚未登陆"))  
    // }
}

module.exports = handleUserRouter