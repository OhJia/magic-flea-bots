var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

var RiveScript = require("./lib/rive/rivescript.js");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

//Create the AlchemyAPI object
// var AlchemyAPI = require('./alchemyapi');
// var alchemyapi = new AlchemyAPI();

var speech_text = "";

var ScopedBot = function(onReady) {

	var self = this;
    self.rs = new RiveScript();

    self.rs.loadFile("lib/brain.rive", function() {
        self.rs.sortReplies();
        console.log("brain loaded");
        onReady();
    }); 

    self.getReply = function(username, message) {
        return self.rs.reply(username, message, self);
    };
};

var bot = new ScopedBot(function(){
	app.post('/keywords', function(req, res){
		var output = {};
		speech_text = req.body.text;
		console.log(speech_text);
		var reply = bot.getReply("soandso", speech_text);
		console.log(reply);
		res.json({keyword: reply});
		
		// alchemyapi.keywords('text', speech_text, { 'sentiment':1 }, function(response) {
		// 	output['keywords'] = { text:speech_text, response:JSON.stringify(response,null,4), results:response['keywords'] };
		// 	if (output.keywords.results && output.keywords.results.length > 0) {
		// 		var result = output.keywords.results[0];
		// 		console.log(result.text);
		// 		var reply = bot.getReply("soandso", result.text);
		// 		console.log(reply);
		// 		res.json({keyword: reply});
		// 	} else {
		// 		console.log("no keywords");
		// 		res.json({keyword: null});
		// 	}		
		// });

	});
});




app.listen(port, function(){
  console.log('started on port ',port);
});

