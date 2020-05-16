const http = require('http')
const express = require('express')
const app = express()                   // create express app
const server = http.createServer(app)   // create node.js http server for app

const socketio = require('socket.io')
const io = socketio(server)             // mount socket.io on the http server

const PORT = process.env.PORT || 3000
const HOSTNAME = process.env.HOSTNAME || 'localhost'


if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static('dist'))
} else {
    // Parcel handles requests if not 'production'
    const Bundler = require('parcel-bundler')
    const bundler = new Bundler('client/index.html')
    app.use('/', bundler.middleware())
}


let numUsers = 0;
io.on('connection', (socket) => {

    socket.on('add user', (username) => {
        if (addedUser) return
        socket.username = username
        ++numUsers
        addedUser = true
        socket.emit('login', {
            numUsers: numUsers
        })
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        })
    })

    socket.on('client-to-server', (msg) => {
        console.log(`client-to-server: "${msg}"`)
        socket.emit('server-to-client', `Received message:"${msg}"`)
    })

    socket.on('disconnect', () => {
        console.log(`disconnected`)
    })
})


server.listen(PORT, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/ )`)
})