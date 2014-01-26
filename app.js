
/**
 * Module dependencies.
 */

var express = require('express')
  , flash = require('connect-flash')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , format = require('util').format
  , booking = require('./routes/booking')
  , admin = require('./routes/admin')
  , common = require('./common/common');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.compress());
  //app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
  //app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser({uploadDir:'./'}));
  app.use(express.session({ secret: 'bookabus' }));
  app.use(express.methodOverride());
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// initialize db connection once and use it everywhere
mongoose.connect('mongodb://localhost/bookabusdb');
var db = mongoose.connection;
db.on('error', function(err){
  if(err){
    db.db.close();
    connect();
  }
});

function connect(){
  db.open('localhost', 'bookabusdb'); 
}

process.on('uncaughtException',function(e){
  console.log("Error=>" + e);
});
app.get('/',booking.index);
app.get('/luggage/index',function(req,res){
  res.render('luggage-index');
});
app.get('/seat/index',function(req,res){
  res.render('seat-index',{busNumbers: admin.getBusNumbers()});
});
app.get('/seat/historyindex',function(req,res){
  res.render('seat-history-index',{busNumbers: admin.getBusNumbers()});
});
//seat booking urls
app.get('/seat/booking',booking.seatBookingView);
app.post('/seat/booking',booking.seatBookingView);
app.post('/seat/dobooking',booking.doSeatBooking);
app.get('/seat/bookinghistory',booking.showSeatBookingHistory);
app.get('/seat/viewticket/:bookingid',booking.showSeatBooking);
app.get('/seat/cancel',booking.cancelSeatBooking);

//luggage booking urls
app.get('/luggage/booking',booking.luggageBookingView);
app.post('/luggage/dobooking',booking.doLuggageBooking);
app.get('/luggage/bookinghistory',booking.showLuggageBookingHistory);
app.get('/seat/viewluggage/:bookingid',booking.showLuggageTicket);
app.get('/setluggagetoload',booking.loadLuggage);
app.get('/loadedluggage/index',function(req,res){
  res.render('luggage-index');
});
app.post('/viewloadedluggage',booking.loadedLuggageView);
app.get('/removeluggage',booking.removeLuggage);
app.get('/removeloadedluggage',booking.removeLoadedLuggage);
app.get('/add/bus', admin.addBusView )
app.post('/add/bus', admin.addBus)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
