/*
  SPEECH RECOGNITION
*/
var recognizing;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
//recognition.start();
//recognizing = true;
recognizing = false;
//reset();
//recognition.onend = reset;

var textToP5;
var text = "";

recognition.onresult = function (event) {
  console.log("start speech")
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      //textarea.value += event.results[i][0].transcript;
      text = event.results[i][0].transcript;
      //console.log("text")
      //console.log(text); 
      $.post( "/keywords", {text: text}, function(data) {
      console.log(data); 
      if (data && data.keyword) {
        textToP5 = data.keyword;
      } else {
        textToP5 = null;
      }

    }, 'json');
    }
  }
}

// function reset() {
//   recognizing = false;
//   //button.innerHTML = "Click to Speak";
// }

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    console.log("speech stopped");
    //reset();
    recognizing = false;
  } else {
    recognition.start();
    console.log("speech started");
    recognizing = true;
    //button.innerHTML = "Click to Stop";
  }
}

/*
  END SPEECH RECOGNITION
*/



var attrImages = [];
var counter=0;
var numImg=4

movers = [];
attractors = [];

var densitySkipper = 5;



var a;
var z = 0;
var change = false;

function preload() {

  attrImages[0] = loadImage("../media/icon.png");
  attrImages[1] = loadImage("../media/cat.jpg");

}


function setup() {
  var myCan = createCanvas(500, 500);
  myCan.parent('p5-canvas');
  //resetPoints(counter);

  attractors=[];
  movers=[];
  attrImages[z].loadPixels();

  
  //console.log(attrImages[z]);

  for (i = 0; i < width; i += densitySkipper) {
   for (j = 0; j < height; j += densitySkipper) {
    var pixelLoc = 4 * (i + (j * width));


    if (attrImages[z].pixels[pixelLoc] > 0 && attrImages[z].pixels[pixelLoc] < 244) {
     var loc = createVector(i, j);
     // console.log("loc: ", loc);
     a = new Attractor(loc);
     attractors.push(a);

    }
   }
  }
  attrImages[z].updatePixels();


  for (i = 0; i < attractors.length; i++) {
   var m = new Mover(random(0.05, 0.1), random(width), random(height));
   movers.push(m);
  }
 
}

function resetPoints(z){
  
  attractors=[];
  //movers=[];
  attrImages[z].loadPixels();

  
  //console.log(attrImages[z]);

  for (i = 0; i < width; i += densitySkipper) {
   for (j = 0; j < height; j += densitySkipper) {
    var pixelLoc = 4 * (i + (j * width));


    if (attrImages[z].pixels[pixelLoc] > 0 && attrImages[z].pixels[pixelLoc] < 244) {
     var loc = createVector(i, j);
     // console.log("loc: ", loc);
     a = new Attractor(loc);
     attractors.push(a);

    }
   }
  }
  attrImages[z].updatePixels();


  // for (i = 0; i < attractors.length; i++) {
  //  var m = new Mover(random(0.1, 1), random(width), random(height));
  //  movers.push(m);
  // }
 
 
}


function draw() {

  background(255, 80);


  for (i = 0; i < attractors.length; i++) {
    var attr = attractors[i];  
    var mov = movers[i]; 
    if (mov) {
      var force = attr.attract(mov); 
      mov.applyForce(force);
      mov.run();
    }    
  }

  if (textToP5) {
    change = true;
  } else {
    change = false;
  }

  if (change == true) {
    updateImage();
    change = false;
  }

}

function mousePressed() {
  toggleStartStop();
  var mousePos = createVector(mouseX, mouseY);
  console.log(mousePos);
  if (mouseX > 0 && mouseY > 0 && mouseX < 500 && mouseY < 500) {
    for (i = 0; i < movers.length; i++) {
      var newMover = movers[i];
      var force = p5.Vector.sub(newMover.location, mousePos);
      var distance = force.mag();
      distance = constrain(distance, 5.0, 10.0);
      force.normalize();
      //console.log("distance: ", distance);
      // var strength =  (distance) /(200 * movers[i].mass) ;
      // force.mult(strength);
      force.mult(0.3);
      newMover.applyForce(force);
    }

  }

  
}

function updateImage() {

 //console.log(z)
  if (textToP5) {
    console.log ("textToP5", textToP5);
    if (textToP5 == "dog") {
      //attrImages[0].loadPixels();
      z = 0;
      // attrImages[z].loadPixels();
      // attrImages[z].updatePixels();
      resetPoints(z);
    } else if (textToP5 == "cat") {
      z = 1;
      // attrImages[z].loadPixels();
      // attrImages[z].updatePixels();
      resetPoints(z);
    }
 } 

 textToP5 = null;

}






