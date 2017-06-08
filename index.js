var express = require("express");
var app = express();

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Define Mongoose Schema --> corresponding with a collection of MongoDB ('queries')
var historySchema = new Schema({
	query: String,
	time: {type: Date, default:Date.now}
},{
    collection:'queries'
});

//create Mongoose model 
var Model = mongoose.model('Model',historySchema)
//and connect  to MongoDB on Mlab
mongoose.connect('mongodb://nghiaoi11:9732298@ds115752.mlab.com:15752/image')

app.get('/', function(req, res) {
    res.send('Hello from NGHIA, what images will you search? . <br> <br> Example: <a href= https://shielded-sea-69229.herokuapp.com/new/http://vnexpress.net> https://shielded-sea-69229.herokuapp.com/new/http://vnexpress.net </a> <br> <br> Github: <a href= https://github.com/nghiaoi3/urlshorter>Github</a>');
});

app.get('/lastest', function(req, res) {
    res.send('Hello from NGHIA, please provide your URL (http://yourdomain) needed a short code. <br> <br> Example: <a href= https://shielded-sea-69229.herokuapp.com/new/http://vnexpress.net> https://shielded-sea-69229.herokuapp.com/new/http://vnexpress.net </a> <br> <br> Github: <a href= https://github.com/nghiaoi3/urlshorter>Github</a>');
});


app.get('/search/:q', function(req, res) {
    var query = req.params.q;
    // a query is a model of Mongoose ~ a document of MongoDb
    var savedate = new Model({
        'query':query,
        'time':Math.floor(Date.now()/1000)
        
    }).save(function(err,result) {
        if (err) throw err;
        if (result) {
            res.json(result)
        }
    }
        );
});

//create a server
var port = process.env.PORT || 3000
var server = app.listen(port, function(){
    console.log('server is listening ' +port);
});