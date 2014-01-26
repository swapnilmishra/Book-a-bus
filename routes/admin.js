exports.addBusView = function(req,res){
	res.render('addbus');
}

exports.addBus = function(req,res){
	res.render('addbus');
}

exports.getBusNumbers = function(){
	var busNumbers = [
		'MP093',
		'MP036'
	];
	return busNumbers;
}