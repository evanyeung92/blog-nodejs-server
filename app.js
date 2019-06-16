const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get, set } = require('./src/db/redis')


const getCookieExpires  = () =>{
    const now = new Date()
    now.setTime(now.getTime() + (24*60*60*1000))
    return now.toGMTString()
}

//处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    res.setHeader('Content-type', 'application/json');
    const url = req.url
    //解析 path
    req.path = url.split('?')[0]
    //解析 query
    req.query = querystring.parse(url.split('?')[1])

    //解析 cookie
    req.cookie = {}
    const cookieString = req.headers.cookie || '';
    //正则解析 更快
    //req.cookie = queryString.parse(cookie.replace(/\s*;\s*/g,'&'));
    cookieString.split(';').forEach(item =>{
        if(!item) return
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    //Redis处理Session
    let needSetCookie = false
    let userId = req.cookie.userid
    if(!userId){
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        //初始化session
        set(userId, {})
    }
    //获取session
    req.sessionId = userId
    get(userId).then(sessiontData =>{
        if(sessiontData == null){
            set(req.sessionId, {})
            req.session = {}
        } else {
            req.session = sessiontData
        }
        console.log('request session', req.session)

        return getPostData(req)
    })
    .then(postData => {
        req.body = postData

        //blog router
        const blogResult = handleBlogRouter(req, res)
        if(blogResult){
            blogResult.then(blogData =>{
                if(needSetCookie){
                    //操作cookie, httpOnly限制了前端更改cookie
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()} `)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        //user router
        const userData = handleUserRouter(req, res)
        if (userData) {
            userData.then(user => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()} `)
                }
                res.end(
                    JSON.stringify(user)
                )
            })
            return
        }
        //handle 404
        res.writeHead(404, {
            'Content-type': 'application/json'
        })
        res.write("404 Not Found\n")
        res.end()
    })

}

module.exports = serverHandle;