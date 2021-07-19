// 导入nodejs-websocket包
const ws = require('nodejs-websocket')
const PORT = 3333
let count = 0
const TYPE_ENTER = 0
const TYPE_LEAVE = 1
const TYPE_MSG = 2
// 返回的消息是一个对象
// type：消息的类型 0 表示进入聊天室的消息 1：用户离开聊天室的消息 2：正常的聊天
// msg：消息的内容
// time: 聊天的具体时间
// 2.创建一个server
const server = ws.createServer(connect =>{
    console.log('有用户连接上来了')
    count++
    connect.userName = `用户${count}`
    broadcast({
        type: TYPE_ENTER,
        msg: `${connect.userName}进入了聊天室`,
        time: new Date().toLocaleTimeString()
    })
    // 每当接收到用户传递过来的数据，这个text事件会被触发
    connect.on('text',data=>{
        // console.log('接受到了用户的数据',data)
        // connect.send(data.toUpperCase()+'!!!')
        broadcast({
            type: TYPE_MSG,
            msg: connect.userName+": "+data,
            time: new Date().toLocaleTimeString()
        })
    })

    connect.on('close',()=>{
        console.log('关闭连接')
        count--
        broadcast({
            type: TYPE_LEAVE,
            msg: `${connect.userName}离开了聊天室`,
            time: new Date().toLocaleTimeString()
        })
    })
    // 注册一个error事件
    connect.on('error',()=>{
        console.log('用户连接异常')
    })
})

function broadcast(msg) {
    server.connections.forEach(item =>{
        item.send(JSON.stringify(msg))
    })
}

server.listen(PORT,()=>{
    console.log("websocket服务启动成功了，监听了端口"+PORT)
})