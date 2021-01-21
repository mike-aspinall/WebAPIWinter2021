var express = require('express')
var mongoose = require('mongoose')
var app = express()
var path = require('path')
var bodyparser = require('body-parser')
//var router = express.Router()

//sets up our middleware to use in our appplication
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/gameEntries', {
    useNewUrlParser:true
}).then(function(){
    console.log("Connected to MongoDB Database")
}).catch(function(err){
    console.log(err)
})

//Load in database templates
require('./models/Game')
var Game = mongoose.model('game')

//basic code for saving an entry
/*var Game = mongoose.model('Game', {nameofgame:String})

var game = new Game({nameofgame:'Skyrim'})
game.save().then(function(){
    console.log("Game Saved")
})*/

app.post('/saveGame', function(req,res){
    console.log("Request Made")
    console.log(req.body)

    new Game(req.body).save().then(function(){
        res.redirect('gamelist.html')
    })
})

app.get('/getData', function(req,res){
    Game.find({}).then(function(game){
        res.json({game})
    })
})

//post route to delete game entry
app.post('/deleteGame', function(req,res){
    console.log("Game Deleted", req.body._id)
    Game.findByIdAndDelete(req.body._id).exec()
    res.redirect('gamelist.html')
})

app.use(express.static(__dirname+"/views"))

app.listen(3000, function(){
    console.log("Listening on port 3000")
})