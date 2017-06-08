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
    res.send('Hello from NGHIA, what images will you search? . <br> <br> Example: Search Images about / of/ regarading <a href= https://radiant-chamber-77452.herokuapp.com/search/vietnam> Vietnam </a> <br> <br> Github: <a href= https://github.com/nghiaoi3/urlshorter>Github</a>');
});

app.get('/lastest', function(req, res) {
    
    Model.find()
    .select({_id:0, query:1, time:1})
    .sort({time:1})
    .limit(10)
    .then(results=>{
        res.json(results);
    });
});


app.get('/search/:q', function(req, res) {
    var query = req.params.q;
    // a query is a model of Mongoose ~ a document of MongoDb
    var savedate = new Model({
        'query':query,

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