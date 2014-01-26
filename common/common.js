var CounterModel = require('../models/countersmodel').getCounter();

exports.getNextSequence = function(seqparam,callback){

	console.log("getting next seq for " + seqparam);

	var conditions = {_id:seqparam};
	var update = {$inc: {seq:1}};
	var options = {new:true};

	CounterModel.findOneAndUpdate(conditions,update,options,function(err,doc){
		callback(doc.seq);
	});
}