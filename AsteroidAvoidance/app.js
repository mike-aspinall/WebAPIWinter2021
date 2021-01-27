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

mongoose.connect('mongodb://localhost:27017/asteroidGameEntries', {
    useNewUrlParser:true
}).then(function(){
    console.log("Connected to MongoDB Database")
}).catch(function(err){
    console.log(err)
})

//Load in database templates
require('./models/Score')
var Score = mongoose.model('highscores')

//basic code for saving an entry
/*var Game = mongoose.model('Game', {nameofgame:String})

var game = new Game({nameofgame:'Skyrim'})
game.save().then(function(){
    console.log("Game Saved")
})*/

app.post('/saveHighScore', function(req,res){
    console.log("Request Made")
    console.log(req.body)

    new Score(req.body).save().then(function(){
        res.redirect('highScores.html')
    })
})

app.get('/getData', function(req,res){
    //Score.find({}).sort([['score', -1]])

    Score.find({}).then(function(score){
        res.json({score})
    })
})

app.use(express.static(__dirname+"/views"))

app.listen(5000, function(){
    console.log("Listening on port 5000")
})