import express from 'express';
import cors from "cors";
import morgan from "morgan";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import pkg1 from 'mongoose';
const { Schema: _Schema, connect, model } = pkg1;

import pkg from 'body-parser';
const { urlencoded, json: jayson } = pkg;

import methodOverride from "method-override";

const Schema = _Schema;

var MongoUri = "mongodb://bnarasimha21:1nvin$ible@cluster0-shard-00-00-shwiy.mongodb.net:27017/FlipIt?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
connect(MongoUri, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
app.use(cors());
app.use(express.static(__dirname));
app.use(morgan('dev'));
app.use(urlencoded({'extended':'true'}));
app.use(jayson());
app.use(jayson({type: 'application/vhd.api+json'}));
app.use(methodOverride());


const ScoreSchema = Schema ({
    name : String,
    totalseconds: Number,
    clicks : Number,
    topic: String,
    createdDate : Date
});
var Score = model('scores', ScoreSchema);


app.get('/api/getScores/:topic', function(req, res){
  var topic = req.params.topic;

  Score.find({'topic': topic},function(err, scores){
      if(err){
          console.log(err);
      }

      var finalscores = [];
      scores.forEach(element => {
        var fscore = {
          _id : element._id,
          name : element.name,
          totalseconds : element.totalseconds,
          clicks : element.clicks,
          secondsplusclicks : (element.totalseconds + element.clicks) / 2,
          topic : element.topic,
          createdDate : element.createdDate
        }
        finalscores.push(fscore);
      })
      finalscores.sort(function(a, b){return a.secondsplusclicks - b.secondsplusclicks});
      finalscores = finalscores.slice(0,10);
      res.json(finalscores);
  })
});

app.get('/api/totalGames', function(req, res){
  Score.find(function(err, totalGames){
      if(err){
          console.log(err);
      }
      res.json(totalGames.length);
  })
});

app.get('/api/recentGames', function(req, res){
  Score.find(function(err, totalGames){
      if(err){
          console.log(err);
      }
      res.json(totalGames);
  })
  .sort({createdDate: 'descending'})
  .limit(20)
});

app.get('/api/players', function(req, res){
  Score.distinct("name", function(err, players){
      if(err){
          console.log(err);
      }
      res.json(players);
  })
});

app.get('/api/playersCount', function(req, res){
  Score.distinct("name", function(err, distinctPlayers){
      if(err){
          console.log(err);
      }
      res.json(distinctPlayers.length);
  })
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

export { app };
