var mongoose = require('mongoose')
//like URL, but its the connection to the database
var dbURI = 'mongodb+srv://dbUser:dbPassword@finalproject.pyx8c.mongodb.net/FinalDatabase?retryWrites=true&w=majority'

if (process.env.NODE_ENV === 'production') {
    dbURI = dbURI
}

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.Promise = Promise

//mongoose.connection.on('connected', function() {
//    console.log("Mongoose connected to " + dbURI)
//})