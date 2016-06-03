var express = require('express');
var router = express.Router();
var http = require('http');
var mongoose = require('mongoose');

var request = require("request");
var jsonQuery = require('json-query');


mongoose.connect('mongodb://ChanYiLin:jack19940319@ds011923.mlab.com:11923/hackthondatabase');
//mongoose.connect('mongodb://1)
//mongoose.connect('mongodb://' + "127.0.0.1" + '/' + "TrainTableTest");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('mongoDB connected');
});

//lets require/import the mongodb native drivers.
//var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
//var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
//var url = 'mongodb://127.0.0.1/TrainTableTest';

/* GET home page. */
router.get('/', function(req, res, next) {
	var data = ["car","dog"];
  	res.render('index');
});

router.post('/getBusData',function(req,res,next){
	var data;
	var busNum = "1619";
	var dataArr = [];
	
	var startName = req.body.startstop;
	
	console.log(busNum);
	//var openData = "http://ptx.transportdata.tw/MOTC/v1/Bus/EstimatedTimeOfArrival/Taipei/"+busNum+"?top=10&format=JSON";
	var openData = "http://ptx.transportdata.tw/MOTC/v1/Bus/EstimatedTimeOfArrival/Thb/"+busNum+"?&format=JSON"
	//var url = "http://ptx.transportdata.tw/MOTC/Rail/THSR/DailyTimetable?format=JSON";

	//var url = "http://ptx.transportdata.tw/MOTC/Rail/THSR/DailyTimetable?format=JSON";
	request({
	    url: openData,
	    json: true
	}, function (error, response, body) {
		console.log(error);
		data = body;
		if(error){
			console.log(error);
		}
	    if (!error && response.statusCode === 200) {
	      console.log(body) // Print the json response
	      //var str = JSON.Stringify(body);
	      var i;

	      console.log(body.length);
	      for(i=0;i<body.length;i++){
	      	console.log(body[i].StopName.Zh_tw);

	      	if(body[i].StopName.Zh_tw == startName){
	      		console.log("equal");
	      		dataArr.push(body[i]);
	      		console.log(body[i].EstimateTime);
	      	}
	      }
	      console.log(dataArr);
	      //jsonData = JSON.stringify(dataArr);
	      res.send(dataArr);
	      //res.json(jsonData);
	    }
	})
});

router.post('/getTrainData',function(req,res,next){
	var station = {};

	station["台北"] = "1008";
	station["新竹"] = "1025";
	station["台南"] = "1228";
	station["高雄"] = "1238";
	station["台中"] = "1319";
	//console.log("*****台中："+station[台中]+"*****");
	var data = ["car","dog"];
	var i,j;
	var dataArr = [];
	 //{ startstop: startstop, endstop : endstop, starttime: starttime, endtime: endtime},

	var startstop = req.body.startstop;
	var endstop = req.body.endstop;
	var starttime = req.body.starttime;
	var endtime = req.body.endtime;
	var finalstarttime = starttime.split(" ");
	var finalendtime = endtime.split(" ");

	var start = station[startstop];
	var end = station[endstop];
	console.log(start);
	console.log(end);
	console.log(finalstarttime[1]);
	console.log(finalendtime[1]);


	db.collection('TrainTableTest').find({
		    $and:[{
		        'DailyTrainInfo.Direction':0
		        },{
		         StopTimes:{$elemMatch:{
		             'StationID': start,
		             ArrivalTime: {$gte: finalstarttime[1]},
		             }}
		        },{
		           StopTimes:{$elemMatch:{
		             'StationID': end,
		              ArrivalTime: {$lte: finalendtime[1]}
		             }}
		        }
		]}).toArray(function(err,result){
			//jsonData = JSON.stringify(result);
			console.log(result);
	        console.log("success");
	        for(i = 0;i < result.length;i++){
	        	dataArr.push(result[i]);
	        	console.log("here");
	      		/*for(j = 0;j < result[i].StopTimes.length ;j++){
	      			console.log("here2");
	      			if(result[i].StopTimes[j].StationID == "1319"){
	      				console.log("here3");
	      				console.log(result[i].StopTimes[j].ArrivalTime);
	      				dataArr.push(result[i].StopTimes[j].ArrivalTime);
	      			}
	      			if(result[i].StopTimes.StationID == "1008"){
	      				dataArr.push(result[i].StopTimes[j].ArrivalTime);
	      			}
	      			
	      		}*/
	      	}
	      	//jsonData = JSON.stringify(dataArr);
	      	//res.write(jsonData);
	      	res.send(dataArr);
			//res.send(jsonData);
	      //Close connection
	      //db.close();
		});



	// Use connect method to connect to the Server
	/*MongoClient.connect(url, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  } else {

	    //HURRAY!! We are connected. :)
	    console.log('Connection established to', url);

	    // Get the documents collection
	    var collection = db.collection('TrainTableTest');

	    collection.find({
		    $and:[{
		        'DailyTrainInfo.Direction':1
		        },{
		         StopTimes:{$elemMatch:{
		             'StationID': "1319",
		             ArrivalTime: {$gte:'05:40:00'}
		             }}
		        },{
		           StopTimes:{$elemMatch:{
		             'StationID':"1120",
		              ArrivalTime: {$lte:'10:00:00'}
		             }}
		        }
		]}).toArray(function(err,result){
		      if (err) {
		        console.log(err);
		      } else {
		        console.log("success");
		        console.log(result);
		      }
		      //Close connection
		      db.close();
		});
	  }
	});*/
});
module.exports = router;