const WebSocket = require('ws')
const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ port: 8080 })
const nanoid = require('nanoid')

let database = [],
    newMessage = {}

wss.on('connection', function connection(ws) {

    let firstMessage = JSON.stringify({
        new: nanoid(),
        data: database
    })
    ws.send(firstMessage)

    ws.on('message', function incoming(message) {
        const res = JSON.parse(message)
        let { id, date, msg } = res
        newMessage = { id, date, msg }
        database.push(newMessage)
        let sendMessage = JSON.stringify(newMessage)
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(sendMessage)
            }
        })
    })

})
