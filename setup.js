
// Setup
var express = require('express');
var app = express();
var cors = require('cors');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
const Schema = mongoose.Schema;

var MongoUri = "mongodb://bnarasimha21:1nvin$ible@cluster0-shard-00-00-shwiy.mongodb.net:27017/FlipIt?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
mongoose.Promise = global.Promise;
mongoose.connect(MongoUri, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// Configuration
app.use(cors());
app.use(express.static(__dirname));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vhd.api+json'}));
app.use(methodOverride());


const ScoreSchema = Schema ({
    name : String,
    minutes : Number,
    seconds : Number,
    totalseconds: Number,
    clicks : Number,
    topic: String
});
var Score = mongoose.model('scores', ScoreSchema);


app.get('/api/getScores/:topic', function(req, res){
  var topic = req.params.topic;

  Score.find({'topic': topic},function(err, scores){
      if(err){
          console.log(err);
      }
      res.json(scores);
  })
  .sort({clicks: 'ascending'})
  .sort({totalseconds: 'ascending'})
  .limit(10)
});

app.post('/api/addScore', function(req, res){
  var score = new Score({
    name : req.body.name,
    totalseconds : req.body.totalseconds,
    clicks : req.body.clicks,
    topic : req.body.topic,
    createdDate : req.body.createdDate
  });

  Score.create(score, function(err, addedScore){
    if(err) console.log(err);
    res.json(addedScore);
  })
});

module.exports = app;
