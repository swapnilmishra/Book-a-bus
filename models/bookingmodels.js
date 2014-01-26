var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
			customerName : String,
			bookingId : String,
			dateOfJourney : Date,
			busNumber : String,
			bookingDate: {type: Date, default: Date.now},
			seats : String,
			phoneNumber : Number,
			departureTime : String,
			amount : Number,
			gender: String
})

var luggageBookingSchema = mongoose.Schema({
			fromName : String,
			toName : String,
			bookingId : String,
			bookingDate: {type: Date, default: Date.now},
			loadingDate: Date,
			busNumber : String,
			status : {type: String, default : 'new'},
			station : String,
			parcel : String,
			parcelType : String,
			transportCharges : Number
})

var BookingModel = mongoose.model('SeatLists',bookingSchema);

var LuggageBookingModel = mongoose.model('LuggageList',luggageBookingSchema);

exports.getBookingModel = function(){
	return BookingModel;
}

exports.getLuggageBookingModel = function(){
	return LuggageBookingModel;
}