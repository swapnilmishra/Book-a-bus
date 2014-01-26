var common = require('../common/common')
	,	admin = require('../routes/admin')
	,	_ 	= require('underscore')
	,	async = require('async')
	,	BookingModel = require('../models/bookingmodels').getBookingModel()
	,	LuggageBookingModel = require('../models/bookingmodels').getLuggageBookingModel()

exports.index = function(req,res){
	res.render('index');
}

// home page view render
exports.seatBookingView = function(req,res){

	var sleeperSeats = {
		top : [ 'C','F','I','L','O' ],
		middle : [ 'B','E','H','K','N' ],
		down : [ 'A','D','G','J','M' ]
	};
	var seatTypes = ['top','middle','down'];
	var bookedSeats = [];
	var femaleSeats = [];
	var today = new Date();
	var dateObj = null;
	// console.log(req.body.journeydate);
	if(req.body && req.body.journeydate && req.body.busnumber){
		dateObj = getJSDate(req.body.journeydate);
		console.log("Date from UI=>"  + dateObj);
		BookingModel
			.find()
			.and([{'dateOfJourney' : dateObj},{'busNumber' : req.body.busnumber}])
			.select('seats dateOfJourney gender')
			.exec(function(err,result){
				if(err) {
					console.log("Error in seatBookingView =>" + err);
					res.render('errorpage');
				}
				else{

					for(var i=0,j=result.length; i<j; i++){
						bookedSeats = bookedSeats.concat(result[i].seats.split(','));
						if(result[i].gender == 'F') femaleSeats = femaleSeats.concat(result[i].seats.split(','));
						console.log(result[i].dateOfJourney);
					}
					console.log( "bookedSeats=>" + bookedSeats);
					console.log( "femaleSeats=>" + femaleSeats);
					res.render('seatbookingview',{
						dateOfJourney: dateObj,
						busNumber : req.body.busnumber,
						sleeperSeats:sleeperSeats,
						seatTypes:seatTypes,
						bookedSeats : bookedSeats,
						femaleSeats : femaleSeats,
						busNumbers: admin.getBusNumbers()
					});
				}
			});
	}
	else {
		 // dateObj = new Date(today.getFullYear(),today.getMonth(),today.getDate());
		 res.redirect('/seat/index');
	}
	
}

exports.showSeatBooking = function(req,res){
	BookingModel
		.findOne({'bookingId' : req.route.params.bookingid})
		.exec(function(err,seat){
			res.render('seatticket', seat );
		});
}

exports.doSeatBooking = function(req,res){
	var requestData = req.body;
	common.getNextSequence('bookingId',function(seq){
		var booking = new BookingModel({
			customerName : requestData.customer_name,
			bookingId : seq + '',
			dateOfJourney : requestData.journey_date,
			busNumber : requestData.bus_number,
			seats : requestData.seat_numbers,
			phoneNumber : requestData.phone_number,
			departureTime : requestData.departure_time,
			amount : requestData.amount,
			gender : requestData.gender
		});
		booking.save(function(error,seat){
			if(error) {
				console.log("Error" + error);
			}
			else {
				res.render( 'seatticket', seat );
			}
		});
	});
}

exports.showSeatBookingHistory = function(req,res){

	var dateObj = null
		,	today = new Date()
		,	busNumber = null;

	if(req.query && req.query.bookingdate && req.query.busnumber){
		busNumber = req.query.busnumber;
		dateObj = getJSDate(req.query.bookingdate);
		BookingModel
			.find()
			.and([{'dateOfJourney' : dateObj},{'busNumber' : busNumber}])
			.exec(function(err,seats){
				res.render('seatbookinghistory',{
					dateOfJourney: dateObj,
					busNumber : busNumber,
					seats : seats,
					busNumbers: admin.getBusNumbers()
				});
			});

	} 
	else { 
		// dateObj = new Date(today.getFullYear(),today.getMonth(),today.getDate());
		res.redirect('/');
	}
}

exports.cancelSeatBooking = function(req,res){
	// console.log(req.route.params.bookingid);
	BookingModel.remove({'bookingId' : req.query.bookingid}, function(err){
		if(err) console.log("Error=>" + err);
		else res.send({status : "success"});
	});
}

exports.luggageBookingView = function(req,res){
	res.render('luggagebookingview');
}

exports.doLuggageBooking = function(req,res){
	// consoleLog(req.body);
	var requestData = req.body;
	common.getNextSequence('luggageBookingId',function(seq){
		var booking = new LuggageBookingModel({
			fromName : requestData.from_name,
			toName : requestData.to_name,
			bookingId : seq + '',
			station : requestData.station,
			parcel : requestData.parcel,
			parcelType : requestData.parcel_type,
			transportCharges : requestData.transporting_charges
		});
		booking.save(function(error,luggage){
			if(error) {
				console.log("Error=>" + error);
				res.render('errorpage');
			}
			else {
				res.render('luggageticket',luggage);
			}
		});
	});
}

exports.showLuggageTicket = function(req,res){

	LuggageBookingModel
		.findOne({'bookingId' : req.route.params.bookingid})
		.exec(function(err,luggage){
			res.render('luggageticket', luggage );
		});
}

exports.showLuggageBookingHistory = function(req,res){
	LuggageBookingModel.find({'status' : 'new'})
		.exec(function(error,luggages){
			res.render('luggagebookinghistory',{luggages:luggages,busNumbers: admin.getBusNumbers()});
		});
}

exports.loadLuggage = function(req,res){

	console.log(req.query.bookingids);
	console.log(req.query.loadingdate);
	console.log(req.query.busnumber);
	var bookingIds = req.query.bookingids.split(',')
		,	loadingDate = req.query.loadingdate
		,	updateVal = {
				status : 'loaded',
				loadingDate : getJSDate(loadingDate),
				busNumber : req.query.busnumber
			};
	var query = LuggageBookingModel.find();
	var count = 0;
	for (var i = 0; i < bookingIds.length; i++) {
		LuggageBookingModel
			.update({bookingId : bookingIds[i]},{$set : updateVal },function(err,doc){
				count++;
				if(err){
					console.log("Error=>" + err);
					if(count == bookingIds.length) res.send({status: 'error'});
				}
				else {
					console.log("Success");
					if(count == bookingIds.length) res.send({status: 'success'});
				}
		});
	};
	
}

exports.removeLuggage = function(req,res){
	console.log(req.query.bookingid);
	LuggageBookingModel.remove({'bookingId' : req.query.bookingid}, function(err){
		if(err) console.log("Error=>" + err);
		else res.send({status : "success"});
	});
}

exports.removeLoadedLuggage = function(req,res){
	var bookingIds = req.query.bookingids.split(',')
		,	updateVal = {
				status : 'new',
				loadingDate : null,
				busNumber : null
			};
	var query = LuggageBookingModel.find();
	var count = 0;
	for (var i = 0; i < bookingIds.length; i++) {
		LuggageBookingModel
			.update({bookingId : bookingIds[i]},{$set : updateVal },function(err,doc){
				count++;
				if(err){
					console.log("Error=>" + err);
					if(count == bookingIds.length) res.send({status: 'error'});
				}
				else {
					console.log("Success");
					if(count == bookingIds.length) res.send({status: 'success'});
				}
		});
	};
}

exports.loadedLuggageView = function(req,res){
	var loadingDate =  getJSDate(req.body.bookingdate);
	console.log(loadingDate);
	LuggageBookingModel
		.find()
		.where('loadingDate',loadingDate)
		.exec(function(error,luggages){
			// console.log(luggages);
			for (var i = 0; i < luggages.length; i++) {
				console.log(luggages[i].loadingDate);
			};
			res.render('loadedluggage',{luggages:luggages});
		});
}

/* 
	Date picker sends date in format dd/mm/yyyy but JS date accepts mm/dd/yyyy
	This function converts dd/mm/yyyy format to JS date format.
*/
function getJSDate(dateString){
	var dateString = dateString.split('/');
	return (new Date(dateString[2],parseInt(dateString[1]-1),dateString[0]));
}

function consoleLog(requestData){
	for(obj in requestData){
		console.log(obj + "=>" + requestData[obj] )
	}
}