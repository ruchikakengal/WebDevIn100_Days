var Quaternion = OZ.Class();

Quaternion.fromRotation = function(axis, angle) {
	var DEG2RAD = Math.PI/180;
	var a = angle * DEG2RAD;
	
	var sin = Math.sin(a/2);
	var cos = Math.cos(a/2);
	
	return new this(
		axis[0]*sin, axis[1]*sin, axis[2]*sin, 
		cos
	);
}

Quaternion.fromUnit = function() {
	return new this(0, 0, 0, 1);
}

Quaternion.prototype.init = function(x, y, z, w) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
}

Quaternion.prototype.normalize = function() {
	var norm = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w);
	return new this.constructor(this.x/norm, this.y/norm, this.z/norm, this.w/norm);
}

Quaternion.prototype.conjugate = function() {
	return new this.constructor(-this.x, -this.y, -this.z, this.w);
}

Quaternion.prototype.toString = function() {
	return [this.x, this.y, this.z, this.w].toString(", ");
}

Quaternion.prototype.multiply = function(q) {
	var p = this;
	
	var x = p.w*q.x + p.x*q.w + p.y*q.z - p.z*q.y;
	var y = p.w*q.y + p.y*q.w + p.z*q.x - p.x*q.z;
	var z = p.w*q.z + p.z*q.w + p.x*q.y - p.y*q.x;
	var w = p.w*q.w - p.x*q.x - p.y*q.y - p.z*q.z;
	
	return new this.constructor(x, y, z, w);
}

Quaternion.prototype.toAxis = function() {
	return [this.x, this.y, this.z];
}

Quaternion.prototype.toAngle = function() {
	var RAD2DEG = 180/Math.PI;
	return RAD2DEG * 2 * Math.acos(this.w);
}

Quaternion.prototype.toRotation = function() {
	var axis = this.toAxis();
	var angle = this.toAngle();
	return "rotate3d(" + axis[0].toFixed(10) + "," + axis[1].toFixed(10) + "," + axis[2].toFixed(10) + "," + angle.toFixed(10) + "deg)";
}

Quaternion.prototype.toRotations = function() {
	var RAD2DEG = 180/Math.PI;
	
	var x = RAD2DEG * Math.atan2(2*(this.w*this.x + this.y*this.z), 1 - 2*(this.x*this.x + this.y*this.y));
	var y = RAD2DEG * Math.asin(2*(this.w*this.y - this.x*this.z));
	var z = RAD2DEG * Math.atan2(2*(this.w*this.z + this.x*this.y), 1 - 2*(this.y*this.y + this.z*this.z));
	
	if (x < 0) { x += 360; }
	if (y < 0) { y += 360; }
	if (z < 0) { z += 360; }
	
	return "rotateX(" + x.toFixed(10) + "deg) rotateY(" + y.toFixed(10) + "deg) rotate(" + z.toFixed(10) + "deg)";
}
