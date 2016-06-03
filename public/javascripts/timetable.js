 
var items_one = new vis.DataSet([
	{	start: new Date(2016, 5, 21, 10, 5), //year month day hour minute
		end: new Date(2016, 5, 21, 12, 0),
		content: "this is a train",
		className: "style-train"
	},
	{	start: new Date(2016, 5, 21, 13, 5), 
		end: new Date(2016, 5, 21, 14, 15),
		content: "this is a hsr",
		className: "style-hsr"
	},
	{	start: new Date(2016, 5, 21, 16, 5), 
		end: new Date(2016, 5, 21, 19, 15),
		content: "this is a bus",
		className: "style-bus"
	}
]);

var items_two = new vis.DataSet([
	{	start: new Date(2016, 5, 21, 10, 5), //year month day hour minute
		end: new Date(2016, 5, 21, 12, 0),
		content: "this is a train",
		className: "style-train"
	},
	{	start: new Date(2016, 5, 21, 13, 5), 
		end: new Date(2016, 5, 21, 14, 15),
		content: "this is a hsr",
		className: "style-hsr"
	},
	{	start: new Date(2016, 5, 21, 16, 5), 
		end: new Date(2016, 5, 21, 19, 15),
		content: "this is a bus",
		className: "style-bus"
	}
]);

var options_one = {
	start: new Date(2016, 5, 21, 9, 0),		//user input start time
	end: new Date(2016, 5, 21, 22, 0),		//user input end time
	selectable: false,
	moveable : false,
	zoomable: false
};

var options_two = {
	start: new Date(2016, 5, 21, 9, 0),		//user input start time
	end: new Date(2016, 5, 21, 22, 0),		//user input end time
	selectable: false,
	moveable : false,
	zoomable: false
};

var timeline_one = new vis.Timeline(timetable_one, items_one, options_one);
var timeline_two = new vis.Timeline(timetable_two, items_two, options_two);