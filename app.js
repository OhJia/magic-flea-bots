var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


//Create the AlchemyAPI object
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

var speech_text = "";

function example(req, res) {
	console.log("REQUEST");
	console.log(req.body.text);
	speech_text = req.body.text;
	var output = {};
	console.log("run example");
	//Start the analysis chain
	keywords(req, res, output);
}

function keywords(req, res, output) {
	console.log("run keywords");
	alchemyapi.keywords('text', speech_text, { 'sentiment':1 }, function(response) {
		output['keywords'] = { text:speech_text, response:JSON.stringify(response,null,4), results:response['keywords'] };
		if (output.keywords.results && output.keywords.results.length > 0) {
			var result = output.keywords.results[0];
			console.log(result.text);
			res.json({keyword: result.text});
		} else {
			console.log("no keywords");
			res.json({keyword: null});
		}		
	});
}


app.listen(port, function(){
  console.log('started on port ',port);
});

app.post("/keywords", example);

