/*
  SPEECH RECOGNITION
*/
var recognizing;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognizing = false;

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


function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    console.log("speech stopped");
    recognizing = false;
  } else {
    recognition.start();
    console.log("speech started");
    recognizing = true;
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

var densitySkipper = 3;



var a;
var counter = 0;
var change = false;

function preload() {

  attrImages[0] = loadImage("../media/nothing.jpg");
  attrImages[1] = loadImage("../media/cat.jpg");
  attrImages[2] = loadImage("../media/shrug.jpg");
  attrImages[3] = loadImage("../media/happy.jpg");
  attrImages[4] = loadImage("../media/sad.jpg");
  attrImages[5] = loadImage("../media/fish.jpg");
  attrImages[6] = loadImage("../media/like.jpg");
  attrImages[7] = loadImage("../media/dislike.jpg");
  attrImages[8] = loadImage("../media/love.jpg");
  attrImages[9] = loadImage("../media/cloudy.jpg");
  attrImages[10] = loadImage("../media/angry.jpg");

}


function setup() {
  var myCan = createCanvas(500, 500);
  myCan.parent('p5-canvas');
  //resetPoints(counter);

  attractors=[];
  movers=[];
  //attrImages[counter].loadPixels();

  
  //console.log(attrImages[counter]);

  // for (i = 0; i < width; i += densitySkipper) {
  //  for (j = 0; j < height; j += densitySkipper) {
  //   var pixelLoc = 4 * (i + (j * width));


  //   if (attrImages[counter].pixels[pixelLoc] > 0 && attrImages[counter].pixels[pixelLoc] < 244) {
  //    var loc = createVector(i, j);
  //    // console.log("loc: ", loc);
  //    a = new Attractor(loc);
  //    attractors.push(a);

  //   }
  //  }
  // }
  // attrImages[counter].updatePixels();


  for (i = 0; i < 1000; i++) {
   var loc = createVector(random(1, 499), random(1, 499));
   a = new Attractor(loc);
   attractors.push(a);
   var m = new Mover(random(0.05, 0.1), random(width), random(height));
   movers.push(m);
  }
 
}

function resetImage(counter){
  
  attractors=[];
  //movers=[];
  attrImages[counter].loadPixels();

  for (i = 0; i < width; i += densitySkipper) {
   for (j = 0; j < height; j += densitySkipper) {
    var pixelLoc = 4 * (i + (j * width));


    if (attrImages[counter].pixels[pixelLoc] > 0 && attrImages[counter].pixels[pixelLoc] < 244) {
     var loc = createVector(i, j);
     a = new Attractor(loc);
     attractors.push(a);

    }
   }
  }
  attrImages[counter].updatePixels(); 
}


function draw() {

  background(255, 80);


  if (textToP5) {
    change = true;
  } else {
    change = false;
  }

  if (change == true) {
    matchImage();
    for (i = 0; i < attractors.length; i++) {
      var attr = attractors[i];  
      var mov = movers[i]; 
      if (mov) {
        var force = attr.attract(mov); 
        mov.applyForce(force);
        mov.run();
      }    
    }
    change = false;
  } else {

    for (i = 0; i < attractors.length; i++) {
      //var loc = createVector(random(1, 499), random(1, 499));
      //attractors[i] = new Attractor(loc);
      var attr = attractors[i];  
      var mov = movers[i]; 
      if (mov) {
        var force = attr.attract(mov); 
        mov.applyForce(force);
        mov.run();
      }    
    }

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
      force.mult(0.3);
      newMover.applyForce(force);
    }

  }

  
}

function matchImage() {

 //console.log(counter)
  if (textToP5) {
    console.log ("textToP5", textToP5);
    switch (textToP5) {
      case "dog":
        counter = 0;
        break;
      case "cat":
        counter = 1;
        break;
      case "none":
        counter = 2;
        break;
      case "happy":
        counter = 3;
        break;
      case "sad":
        counter = 4;
        break;
      case "fish":
        counter = 5;
        break;
      case "like":
        counter = 6;
        break;
      case "dislike":
        counter = 7;
        break;
      case "love":
        counter = 8;
        break;
      case "cloudy":
        counter = 9;
        break;
      case "angry":
        counter = 10;
        break;
      default:
        break;
    }
  resetImage(counter); 
    
 } 

 textToP5 = null;

}







