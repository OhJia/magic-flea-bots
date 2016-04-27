function Attractor(location) {
 this.mass = 28;
 this.location = location;
 this.g = .5;

 this.attract = function(m) {
  var force = p5.Vector.sub(this.location, m.location);
  var distance = force.mag();
  distance = constrain(distance, 5.0, 20.0);
  force.normalize();
  var strength = (this.g * this.mass * m.mass) / (distance * distance) ;
  force.mult(strength);
  return force;
 }



 // Method to display
 this.display = function() {
  stroke(0);
  noFill(0);
  ellipse(this.location.x, this.location.y, 8, 8);
 }
}