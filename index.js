var express = require("express");
var app = express();
var request = require('request');

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



// function returns a Promise with request data from Imgur 
function Img (search) {
return new Promise ( (resolve,reject) => {
    
request(options,callback);

var url1 = 'https://api.imgur.com/3/gallery/search/?q='
var url2 = 'https://imgur.com/'
var options = {
    
      url: url1+search,
      headers: { Authorization: '5eda980515f46da' },
      json: true,
    };
    
   // function callback is an argument of request 
function callback(err, response, body) {
  if (!err && response.statusCode == 200) {
    body = body.data.filter(image => {
      if (!image.is_album) {
        return image;
      }
    }).map(image => {
      return {
        url: image.link,
        snippet: image.title,
        context: url2+image.id
      };
    });
          resolve(body)

  }

}

}

);
}

app.get('/', function(req, res) {
    res.send('Hello from NGHIA, what images will you search? . <br> <br> Example: Search Images About / Of/ Regarding <a href= https://radiant-chamber-77452.herokuapp.com/search/vietnam> Vietnam </a> <br> <br> Github: <a href= https://github.com/nghiaoi3/urlshorter>Github</a>');
});


app.get('/search/:q', function(req, res) {
    var query = req.params.q;
    
        Img(query).then(ans=>{
            
             // a queryinfo is a model of Mongoose ~ a document of MongoDb
    var queryinfo = new Model({
        'query':query,
    }).save();
    
            res.json(ans)});
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




//create a server
var port = process.env.PORT || 3000
var server = app.listen(port, function(){
    console.log('server is listening ' +port);
});