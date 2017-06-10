var express = require("express");
var app = express();
var request = require('request');


var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;


//Define Mongoose Schema --> corresponding with a collection of MongoDB ('queries')
var historySchema = new Schema({
	query: String,
	searchby: String,
	time: {type: Date, default:Date.now}
	
},{
    collection:'queries'
});

//create Mongoose model 
var Model = mongoose.model('Model',historySchema)
//and connect  to MongoDB on Mlab
mongoose.connect('mongodb://nghiaoi11:9732298@ds115752.mlab.com:15752/image')


    
// function returns a Promise with data Requested from Imgur 
function Img1 (search) {
return new Promise ( (resolve,reject) => {
    
    
   // function callback is an argument of request 
function callback(err, response, body) {
    
    if (err) {console.err()}
    
  if (!err && response.statusCode == 200) {
    body = body.data.filter(image => {
        
        //not get Albums, only images from Imgur 
      if (!image.is_album) {
        return image;
      }
      
    }).map(image => {
      return {
        url: image.link,
        snippet: image.title,
        context: 'https://imgur.com/+'+image.id
      };
    });
          resolve(body);

  }  else
            reject();

}

//options of request from Imgur
var options = {
    
      url: 'https://api.imgur.com/3/gallery/search/?q='+search,
      headers: { Authorization: 'Client-ID 4ad94661cf8ad99' },
      json: true,
    }
    //execute our request
request(options,callback);

}

);
}




// function returns a Promise with data Requested from Google 
function Img2 (search) {
return new Promise ( (resolve,reject) => {
    
    
   // function callback is an argument of request 
function callback(err, response, body) {
    
    if (err) {console.err()}
    
  if (!err && response.statusCode == 200) {
    body = body['items'].map(image => {
      return {
        url: image['link'],
        snippet: image['snippet'],
        context: image['image']['contextLink'],
        thumbnail: image['image']['thumbnailLink']
      };
    });
          resolve(body);

  }  else
            reject();

}

//options of request from GOOGLE
var options = {
          url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyATAce15nCwO5jN9CWpVvBxulb-hW6OyS0&cx=006811343498659658024:gy0ixlper_o&q='+search+'&searchType=image',
      json: true,
    }
    //execute our request
request(options,callback);

}

);
}

function Img3 (search) {
return new Promise ( (resolve,reject) => {
    
    
   // function callback is an argument of request 
function callback(err, response, body) {
    
    if (err) {console.err()}
    
  if (!err && response.statusCode == 200) {
    body = body['value'].map(image => {
      return {
        url: image['contentUrl'],
        name: image['name'],
        datePublished: image['datePublished']
      };
    });
          resolve(body);

  }  else
            reject();

}

//options of request from BING
var options = {
     url: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q='+search+'&size=medium&offset=10',
      headers: { 'Ocp-Apim-Subscription-Key' : '711ed5e2d1254f8db9965ff10a35f6e7' },
      json: true,
    };
    //execute our request
request(options,callback);

}

);
}
// function returns a Promise with data Requested from Flickr 
function Img4 (search) {
return new Promise ( (resolve,reject) => {
    
    
   // function callback is an argument of request 
function callback(err, response, body) {
    
    if (err) {console.err()}
    
  if (!err && response.statusCode == 200) {
    body = body['photos']['photo'].filter(image => {
        
        //not get Albums, only images from Imgur 
      if (image['title'].indexOf(search) > -1)     {
  return image}
      
    }).map(image => {
      return {
        url: image['url_m'],
        title: image['title'],

      };
    });
          resolve(body);

  }  else
            reject();

}

//options of request from Flickr
var options = {
          url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=84057f4de27df6cf716b4202f1dd2a1b&format=json&nojsoncallback=1&text='+search+'&extras=url_m&media=photos',
      json: true,
    }
    //execute our request
request(options,callback);

}

);
}


app.get('/', function(req, res) {
    res.send('Hello from NGHIA, what images will you search? . <br> <br> Example: Search Images About / Of/ Regarding "Vietnam" on <a href= https://radiant-chamber-77452.herokuapp.com/search/Vietnam> Imgur </a> or by <a href= https://radiant-chamber-77452.herokuapp.com/searchgoogle/Vietnam> Google</a> <br> <a href= https://radiant-chamber-77452.herokuapp.com/lastest> The lastest searches </a>  <br> Github: <a href= https://github.com/nghiaoi3/urlshorter>Github</a>');
});


app.get('/search/:q', function(req, res) {
    var query = req.params.q;
    
    ///get query from url, also as an argument of Img function
        Img1(query).then(ans=>{

             // a queryinfo is a model of Mongoose ~ a document of MongoDb
    var queryinfo = new Model({
        'query':query,
        'searchby': 'IMGUR'
    }).save();
    
            res.json(ans)}).catch(function () {
     console.log("Promise Rejected");
});;
});

app.get('/searchgoogle/:q', function(req, res) {
    var query = req.params.q;
    
    ///get query from url, also as an argument of Img function
        Img2(query).then(ans=>{

             // a queryinfo is a model of Mongoose ~ a document of MongoDb
    var queryinfo = new Model({
        'query':query,
        'searchby': 'GOOGLE'
    }).save();
    
            res.json(ans)}).catch(function () {
     console.log("Promise Rejected");
});;
});

app.get('/searchbing/:q', function(req, res) {
    var query = req.params.q;
    
    ///get query from url, also as an argument of Img function
        Img3(query).then(ans=>{

             // a queryinfo is a model of Mongoose ~ a document of MongoDb
    var queryinfo = new Model({
        'query':query,
        'searchby': 'BING'
    }).save();
    
            res.json(ans)}).catch(function () {
     console.log("Promise Rejected");
});;
});


app.get('/searchflickr/:q', function(req, res) {
    var query = req.params.q;
    
    ///get query from url, also as an argument of Img function
        Img4(query).then(ans=>{

             // a queryinfo is a model of Mongoose ~ a document of MongoDb
    var queryinfo = new Model({
        'query':query,
        'searchby': 'Flickr'
    }).save();
    
            res.json(ans)}).catch(function () {
     console.log("Promise Rejected");
});;
});

app.get('/lastest', function(req, res) {
    
    Model.find()
    .select({_id:0, query:1, searchby:1, time:1})
    .sort({time:-1})
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