var shortid = require('shortid')
var express = require('express')
var app = express()
var serv = require('http').Server(app)
var io = require('socket.io')(serv, {})
var mongoose = require('mongoose')

//other javascript files
require('./db.js')

//model
var User = mongoose.model('users', {
    playername: {
        type: String
    },
    score: {
        type:Number
    },
    timesplayed: {
        type:Number
    }
})

var Admin = mongoose.model('admins', {
    username: {
        type: String
    },
    password: {
        type: String
    },
})

var newAdmin = new Admin({
    username: "mike",
    password: "password"
})

// newAdmin.save(function(error, result) {
//     if (error) {
//         console.log(error)
//     } else {
//         console.log(result)
//     }
// })

app.use(express.urlencoded({extended: true}))
app.use(express.json())

//get route to get data
app.get('/download', function(request, response) {
    User.find({}).then(function(user) {
        response.json({user})
    })
})

//post route to save data
app.post('/upload', function(request, response) {
    console.log("Posting data")
    var newUser = new User({
        playername: request.body.playername,
        score: request.body.score,
        timesplayed: request.body.timesplayed
    })

    newUser.save(function(error, result) {
        if (error) {
            console.log(error)
        } else {
            console.log(result)
        }
    })
})

app.use(express.static(__dirname + "/views"))
serv.listen(3000, function() {
    console.log("App running on port 3000")
})

console.log('server is running')

//gets the data for the list
app.get('/getData', function(request, response){
    //treat this like an array; gets data
    User.find({}).then(function(score){
        response.json({score})
    })
})

var isPasswordValid = function (data, cb) {
    Admin.findOne({ username: data.username }, function (err, username) {
        if (username != null)
            cb(data.password == username.password)
        else
            cb(false)
    })
}

var isUsernameValid = function(data, cb) {
    User.findOne({playername:data.originalName}, function(err, playername) {
        if (playername == null) {
            cb(false)
        } else {
            cb(true)
        }
    })
}

io.sockets.on('connection', function(socket) {
    console.log("Sockets Connection")

    //signIn event
    socket.on('signIn', function (data) {
        isPasswordValid(data, function (res) {
            if (res) {
                //Player.onConnect(socket)
                //send the id to the client
                //socket.emit('connected', socket.id)
                socket.emit('signInResponse', { success: true })
                //log user in
                //signDiv.style.display = "none"
                //gameDiv.style.display = "inline-block"
            } else {
                socket.emit('signInResponse', { success: false })
                //error.innerHTML = "Sign in Unsuccessful"
            }
        })
    })

    socket.on('/editName', function(data) {
        console.log(data.originalName + " " + data.changedName)
        isUsernameValid(data, function(res) {
            if (res) {
                console.log(data.changedName)
                User.updateOne({playername:data.originalName}, {playername:data.changedName}, function (err, docs) { 
                    if (err){ 
                        console.log(err) 
                    } 
                    else{ 
                        console.log("Updated Docs : ", docs); 
                    } 
                });
            } else {
                console.log("you are wrong")
            }
        })
    })
})