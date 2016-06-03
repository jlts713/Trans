
/****initial timeline startTime & endTime****/
var startTime = "";
var endTime = "";


/*******************************************************
*	initial timelines : container, items and options
********************************************************/
var timeline_container = document.getElementById("timeline");
var timetable_one_container = document.getElementById("timetable-one");
var timetable_two_container = document.getElementById("timetable-two");

var timeline_itemlist = [];
var timetable_one_itemlist = [];		//items returned from backend after user press timetable btn1
var timetable_two_itemlist = []; 		//items returned from backend after user press timetable btn2

var timeline_items = new vis.DataSet();
var timetable_one_items = new vis.DataSet(timetable_one_itemlist);
var timetable_two_items = new vis.DataSet(timetable_two_itemlist);

/****returned items from backend****/
/*return format
var timetable_one_itemlist = [
	{	start: new Date(2016, 4, 21, 10, 5), //start time  (year, month, day, hour, minute)
		end: new Date(2016, 4, 21, 12, 0),	 //arrive time (year, month, day, hour, minute)
		content: "this is a train",			 //info of the item
		//className: "style-train",
		id: "train-1"						 //id of the item
	},
	{	start: new Date(2016, 4, 21, 13, 5), 
		end: new Date(2016, 4, 21, 14, 15),
		content: "this is a train too",
		//className: "style-hsr",
		id: "train-2"
	},
	{	start: new Date(2016, 4, 21, 16, 5), 
		end: new Date(2016, 4, 21, 19, 15),
		content: "this is a train three",
		//className: "style-bus",
		id: "train-3"
	}
];

var timetable_one_items = new vis.DataSet(timetable_one_itemlist);
*/
/*************************************/

/****initial timeline options****/
var timeline_options = {
	//start 		//user input start time
	//end			//user input end time
	selectable: true,
	moveable : false,
	zoomable: false
};

var timetable_one_options = {
	//start: new Date(2016, 5, 21, 9, 0),		//user input start time
	//end: new Date(2016, 5, 21, 22, 0),		//user input end time
	selectable: true,
	moveable : false,
	zoomable: false
};

var timetable_two_options = {
	selectable: true,
	moveable : false,
	zoomable: false
};

/****only for testing****/
/*
var timetable_one_options = {
	start: new Date(2016, 4, 21, 9, 0),		//user input start time
	end: new Date(2016, 4, 21, 22, 0),		//user input end time
	selectable: true,
	moveable : false,
	zoomable: false
};*/
/************************/

/****initial timeline****/
var timeline = new vis.Timeline(timeline_container, timeline_items, timeline_options);
var timetable_one = new vis.Timeline(timetable_one_container, timetable_one_items, timetable_one_options);
var timetable_two = new vis.Timeline(timetable_two_container, timetable_two_items, timetable_two_options);


/******************************************************
*	update Timeline start and end time after user input
*******************************************************/
//get start and end time
function getStartAndEndTime(startId, endId){	//('start-time','end-time')
	startTime = document.getElementById(startId).value;
	endTime = document.getElementById(endId).value;

	startTime = startTime.concat(":00");
	endTime = endTime.concat(":00");
	console.log(startTime);
	console.log(endTime);
} 

//set timeline
function setTimeline(startId, endId){
	getStartAndEndTime(startId, endId);	
	updateTimeline(startTime, endTime);
}
//update all three timelines' start and end time
function updateTimeline(startTime, endTime){
	
	timeline_options["start"] = startTime;
	timeline_options["end"] = endTime;
	timeline.setOptions(timeline_options);
	
	
	timetable_one_options["start"] = startTime;
	timetable_one_options["end"] = endTime;
	timetable_one.setOptions(timetable_one_options);
	
	
	timetable_two_options["start"] = startTime;
	timetable_two_options["end"] = endTime;
	timetable_two.setOptions(timetable_two_options);
}


/*****************************************************
*	draw Timetable after user search for timetable
*****************************************************/

function clickTimetableBtnOne(){
	var type = findSelectType("transchoice-one");
	var startstop = document.getElementById("start-place").value;
	var endstop = document.getElementById("trans-place-one").value;
	var busnum = document.getElementById("bus-one-num").value;

	console.log(type);
	if(type == "train"){
		getTrainData(startstop, endstop, startTime, endTime, 1);
	}else if(type == "bus"){
		getBusData(busnum, startstop, 1);
	}else if(type == "hsr"){
		//getHighData();
	}
	// something happened here in backend
	// receive data from backend : update timetable_one_itemlist
	
}

function clickTimetableBtnTwo(){
	var type = findSelectType("transchoice-two");
	var startstop = document.getElementById("trans-place-two").value;
	var endstop = document.getElementById("end-place").value;
	var busnum = document.getElementById("bus-two-num").value;

	console.log(type);
	if(type == "train"){
		getTrainData(startstop, endstop, startTime, endTime, 2);
	}else if(type == "bus"){
		getBusData(busnum, startstop, 2);
	}else if(type == "hsr"){
		//getHighData();
	}
	// something happened here in backend
	// receive data from backend : update timetable_one_itemlist
	//addStyle(timetable_one_itemlist, type);		//add className style
	//timetable_one_items = timetable_one_itemlist;
	//drawTimetable(timetable_one, timetable_one_items);	//draw timeTable	
}

function findSelectType(name){
	var radioGroup = document.getElementsByName(name);
	//console.log(radioGroup);
	var type;
	for(var i = 0; i < radioGroup.length; i++){
		if(radioGroup[i].checked){
			type = radioGroup[i].value;
			break;
		}
	}
	//console.log(type);
	return type;
}


function updateTrainItemList(returnData, tableid){
	var date;
	var stopsnum;
	var starttime;
	var endtime;
	var info;
	var updateStarttime,updateEndtime;
	var j = 0;
	if(tableid == 1){
		timetable_one_itemlist = [];
		for(var i = 0; i < returnData.length; i++){

			date = returnData[i].TrainDate;
			stopsnum = returnData[i].StopTimes.length;
			starttime = returnData[i].StopTimes[0].ArrivalTime;
			endtime = returnData[i].StopTimes[stopsnum-1].ArrivalTime;

			updateStarttime = date + " " + starttime;
			updateEndtime = date + " " + endtime;
			updateStarttime = updateStarttime.replace(/\-/g,".");
			updateEndtime = updateEndtime.replace(/\-/g,".");
				console.log("*****"+updateStarttime+"********");
				console.log("*****"+updateEndtime+"********");

			if(updateStarttime.localeCompare(startTime) == -1){
				console.log(updateStarttime);
				console.log(startTime);

				continue;
			}
			if(updateEndtime.localeCompare(endTime) == 1){
				console.log(updateEndtime);
				console.log(endTime);

				continue;
			}
			//endtime = returnData[i].StopTimes[18].ArrivalTime;
			info = returnData[i].DailyTrainInfo.TrainNo;
			
			console.log(date);
			console.log(date + " " + starttime);
			console.log(date +" " + endtime);
			timetable_one_itemlist[j] = {
				start: updateStarttime, 
				end: updateEndtime,	 
				content: info,			 
				className: "style-train",
				id: j
			}
			j++;
		}
		//console.log();
	}else if(tableid == 2){
		timetable_two_itemlist = [];
		for(var i = 0; i < returnData.length; i++){

			date = returnData[i].TrainDate;
			stopsnum = returnData[i].StopTimes.length;
			starttime = returnData[i].StopTimes[0].ArrivalTime;
			endtime = returnData[i].StopTimes[stopsnum-1].ArrivalTime;
			updateStarttime = date + " " + starttime;
			updateEndtime = date + " " + endtime;
			updateStarttime = updateStarttime.replace(/\-/g,".");
			updateEndtime = updateEndtime.replace(/\-/g,".");

			info = returnData[i].DailyTrainInfo.TrainNo;

			if(updateStarttime.localeCompare(startTime) == -1){
				console.log(updateStarttime);
				console.log(startTime);
				continue;
			}
			if(updateEndtime.localeCompare(endTime) == 1){
				console.log(updateEndtime);
				console.log(endTime);
				continue;
			}
			
			timetable_two_itemlist[j] = {
				start: updateStarttime, 
				end: updateEndtime,
				content: info,			 
				className: "style-train",
				id: j
			}
			j++;
		}
	}
	
}

function updateBusItemList(returnData, tableid){
	var date;
	var starttime;
	var endtime;
	var info;
	var stop;
	var routeTime;
	var stopname;
	var estSec;
	if(tableid == 1){
		stopname = document.getElementById("start-place").value;
	}else if(tableid == 2){
		stopname = document.getElementById("trans-place-two").value;
	}

	var cur = getCurrentTime();	
	console.log(cur);

	//find the bus stop we want
	//console.log(returnData[0].RouteName.Zh_tw);
	for(var i = 0; i < returnData.length; i++){
		var stopName = returnData[i].StopName;
		stop = stopName.Zh_tw;
		console.log('stop: ' + stop);
		if(stopname == stop){
			info = returnData[i].RouteName.Zh_tw;
			estSec = returnData[i].EstimateTime;
			console.log(stop);
			console.log("estimate time :" + estSec);
			break;
		}
	}

	console.log("!!!!!!!!!!!!!render start time !!!!!!!!!!!");
	//add cur time till it reach user's starttime
	//starttime = cur.getFullYear().toString() + ".0" + cur.getMonth().toString() + "." + cur.getDate().toString() + " 0" + cur.getHours().toString() + ":" + cur.getMinutes().toString() + ":" + cur.getSeconds().toString();
	starttime = parseDateFormat(cur);
	console.log(starttime);
	console.log(startTime);
	while(starttime.localeCompare(startTime) == -1){
		//parse time 
		cur = estimateTime(cur, estSec);

		//starttime = cur.getFullYear().toString() + "." + (cur.getMonth()+1).toString() + "." + cur.getDate().toString() + " " + cur.getHours().toString() + ":" + cur.getMinutes().toString() + ":"+cur.getSeconds().toString();
		starttime = parseDateFormat(cur);
		console.log("starttime:" + starttime);
	} 
	
	//initial endtime; set routing time
	//routeTime = ; //sec    guess!!!!!!!!!! some switch case here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	if(stopname == "臺中車站"){	//destination: 朝馬站
		routeTime = 1800;	//sec 
	}else if(stopname == "成淵高中"){
		routeTime = 900;
	}
	console.log("!!!!!!!!!!!!!count end time !!!!!!!!!!!!!!!");
	console.log("cur: " + cur);
	var endTemp = estimateTime(cur, routeTime);
	//endtime = endTemp.getFullYear().toString() + "." + (endTemp.getMonth()+1).toString() + "." + endTemp.getDate().toString() + " " + endTemp.getHours().toString() + ":" + endTemp.getMinutes().toString() + ":" + endTemp.getSeconds().toString();
	endtime = parseDateFormat(endTemp);
	//add items till cur end time reach out of user's endtime
	console.log("endtime:" + endtime);
	if(tableid == 1){
		var i = 0;	
		timetable_one_itemlist = [];
		while(endtime.localeCompare(endTime) == -1){
			console.log("i="+i + " starttime=" + starttime + " endtime=" + endtime);
			timetable_one_itemlist[i] = {
				start: starttime, 
				end: endtime,	 
				content: info,			 
				className: "style-bus",
				id: i
			}
			starttime = endtime;
			endTemp = estimateTime(endTemp, routeTime);
			//endtime = endTemp.getFullYear().toString() + "." + (endTemp.getMonth()+1).toString() + "." + endTemp.getDate().toString() + " " + endTemp.getHours().toString() + ":" + endTemp.getMinutes().toString() + ":"+endTemp.getSeconds().toString();
			endtime = parseDateFormat(endTemp);
			i++;
		}
	}else if(tableid == 2){
		var i = 0;
		timetable_two_itemlist=[];
		while(endtime.localeCompare(endTime) == -1){
			console.log("i="+i + " starttime=" + starttime + " endtime=" + endtime);
			timetable_two_itemlist[i] = {
				start: starttime, 
				end: endtime,	 
				content: info,			 
				className: "style-bus",
				id: i
			}
			starttime = endtime;
			endTemp = estimateTime(endTemp, routeTime);
			//endtime = endTemp.getFullYear().toString() + "." + (endTemp.getMonth()+1).toString() + "." + endTemp.getDate().toString() + " " + endTemp.getHours().toString() + ":" + endTemp.getMinutes().toString() + ":"+endTemp.getSeconds().toString();
			endtime = parseDateFormat(endTemp);
			i++;
		}
	}
}

function parseDateFormat(dt){
	var yearStr = dt.getFullYear().toString();
	var monthStr, dateStr, hrStr, minStr, secStr;
	if(dt.getMonth() < 10){
		monthStr = "0" + dt.getMonth();
	}else{
		monthStr = dt.getMonth();
	}
	if(dt.getDate() < 10){
		dateStr = "0" + dt.getDate();;
	}else{
		dateStr = dt.getDate();;
	}
	if(dt.getHours() < 10){
		hrStr = "0" + dt.getHours();;
	}else{
		hrStr = dt.getHours();;
	}
	if(dt.getMinutes() < 10){
		minStr = "0" + dt.getMinutes();;
	}else{
		minStr = dt.getMinutes();;
	}
	if(dt.getSeconds()< 10){
		secStr = "0" + dt.getSeconds();;
	}else{
		secStr = dt.getSeconds();;
	}
	
	format = yearStr + "." + monthStr + "." + dateStr + " " + hrStr + ":" + minStr + ":" + secStr;
	return format;
}

function getCurrentTime(){
	var cur = new Date();
	var curYear, curMonth, curDate, curHour, curMin, curSec;
	return new Date(cur.getFullYear(), cur.getMonth()+1, cur.getDate(), cur.getHours(), cur.getMinutes(), cur.getSeconds());
}

function estimateTime(curTime, estSec){
	var sec, min, hour;
	var min_addon, hour_addon;
	console.log("curTime:" + curTime);
	console.log("estSec:" + estSec);
	sec = (curTime.getSeconds() + estSec)%60;
	min_addon = (curTime.getSeconds() + estSec)/60;
	min = (curTime.getMinutes() + min_addon)%60;
	hour_addon = (curTime.getMinutes() + min_addon)/60;
	hour = (curTime.getHours() + hour_addon)%24;

	console.log("sec:" + sec + " min:" + min + " hour:" + hour);
	console.log( "min_addon:" + min_addon + " hour_addon:" + hour_addon);
	//ignore change day
	return new Date(curTime.getFullYear(), curTime.getMonth(), curTime.getDate(), hour, min, sec);
}

//set className for each item
function addStyle(itemlist, type){
	var className;
	if(type == "train"){
		className = "style-train";
	}else if(type == "hsr"){
		className = "style-hsr"; 
	}else if(type == "bus"){
		className = "style-bus";
	}
	for(var i = 0; i < itemlist.length; i++){
		itemlist[i]["className"] = className;
		
	}
}

function drawTimetable(timetable, items){
	timetable.setItems(items);
}


/*******************************************
*	add item to timeline from timetables
********************************************/
//TIME TABLE 1
timetable_one.on('select', function (properties) {
	console.log(JSON.stringify(properties));
	console.log(properties["items"][0]);	//get selected item id
	var selectedId = properties["items"][0];
	var selectedItem;
	//search for the selected item
	for(var i = 0; i < timetable_one_itemlist.length; i++){
		//console.log(timetable_one_itemlist[i]["id"] );
		if(timetable_one_itemlist[i]["id"] == selectedId){
			selectedItem = timetable_one_itemlist[i];
			break;
			console.log(JSON.stringify(selectedItem));
		}
	}
	//append the selected item to timeline
	timeline_itemlist.push(selectedItem);
	timeline_items = timeline_itemlist;
	//refresh timeline
	timeline.setItems(timeline_items);
	
});

//TIME TABLE 2
timetable_two.on('select', function (properties) {
	console.log(JSON.stringify(properties));
	console.log(properties["items"][0]);	//get selected item id
	var selectedId = properties["items"][0];
	var selectedItem;
	//search for the selected item
	for(var i = 0; i < timetable_two_itemlist.length; i++){
		//console.log(timetable_two_itemlist[i]["id"] );
		if(timetable_two_itemlist[i]["id"] == selectedId){
			selectedItem = timetable_two_itemlist[i];
			break;
			console.log(JSON.stringify(selectedItem));
		}
	}
	//append the selected item to timeline
	timeline_itemlist.push(selectedItem);
	timeline_items = timeline_itemlist;
	//refresh timeline
	timeline.setItems(timeline_items);
	
});


/***************************************
*	delete item from timeline
*****************************************/
timeline.on('select', function (properties) {
	console.log(properties["items"][0]);	//get selected item id
	var selectedId = properties["items"][0];
	var selectedItem;
	//search for the selected item
	for(var i = 0; i < timeline_itemlist.length; i++){
		//console.log(timeline_itemlist[i]["id"] );
		if(timeline_itemlist[i]["id"] == selectedId){
			selectedIndex = i;
			break;
			console.log(selectedIndex);
		}
	}
	//remove the selected item from timeline
	timeline_itemlist.splice(selectedIndex, 1); 
	timeline_items = timeline_itemlist;
	//refresh timeline
	timeline.setItems(timeline_items);
	
});
