Array.prototype.clone = function() {
	var c = [];
	var len = this.length;
	for (var i=0;i<len;i++) { c.push(this[i]); }
	return c;
}

Array.prototype.random = function() {
	return this[Math.floor(Math.random()*this.length)];
}

var Face = OZ.Class();
Face.SIZE	= 100;
Face.LEFT	= 0;
Face.RIGHT	= 1;
Face.TOP	= 2;
Face.BOTTOM	= 3;
Face.FRONT	= 4;
Face.BACK	= 5;

Face.ROTATION = [
	[Face.TOP, Face.FRONT, Face.BOTTOM, Face.BACK].reverse(),
	[Face.LEFT, Face.BACK, Face.RIGHT, Face.FRONT].reverse(),
	[Face.LEFT, Face.BOTTOM, Face.RIGHT, Face.TOP].reverse()
];

Face.prototype.init = function(cube, type) {
	this._cube = cube;
	this._type = type;
	this._color = null;
	this._node = OZ.DOM.elm("div", {className:"face face"+type, width:Face.SIZE+"px", height:Face.SIZE+"px", position:"absolute", left:"0px", top:"0px"});
	OZ.CSS3.set(this._node, "box-sizing", "border-box");
//	OZ.CSS3.set(this._node, "backface-visibility", "hidden");

	switch (type) {
		case Face.LEFT:
			OZ.CSS3.set(this._node, "transform-origin", "100% 50%");
			OZ.CSS3.set(this._node, "transform", "translate3d(-"+Face.SIZE+"px, 0px, 0px) rotateY(-90deg)");
		break;
		case Face.RIGHT:
			OZ.CSS3.set(this._node, "transform-origin", "0% 50%");
			OZ.CSS3.set(this._node, "transform", "translate3d("+Face.SIZE+"px, 0px, 0px) rotateY(90deg)");
		break;
		case Face.TOP:
			OZ.CSS3.set(this._node, "transform-origin", "50% 100%");
			OZ.CSS3.set(this._node, "transform", "translate3d(0px, -"+Face.SIZE+"px, 0px) rotateX(90deg)");
		break;
		case Face.BOTTOM:
			OZ.CSS3.set(this._node, "transform-origin", "50% 0%");
			OZ.CSS3.set(this._node, "transform", "translate3d(0px, "+Face.SIZE+"px, 0px) rotateX(-90deg)");
		break;
		case Face.FRONT:
		break;
		case Face.BACK:
			OZ.CSS3.set(this._node, "transform", "translate3d(0px, 0px, -"+Face.SIZE+"px) rotateY(180deg)");
		break;
	}
}

Face.prototype.getCube = function() {
	return this._cube;
}

Face.prototype.getNode = function() {
	return this._node;
}

Face.prototype.getType = function() {
	return this._type;
}

Face.prototype.setColor = function(color) {
	this._color = color;
	this._node.style.backgroundColor = color;
}

Face.prototype.getColor = function() {
	return this._color;
}

var Cube = OZ.Class();
Cube.prototype.init = function(position) {
	this._rotation = null;
	this._position = position;
	this._node = OZ.DOM.elm("div", {className:"cube", position:"absolute", width:Face.SIZE+"px", height:Face.SIZE+"px"});
	this._faces = {};
	this._tmpFaces = {};
	OZ.CSS3.set(this._node, "transform-style", "preserve-3d");

	this._update();
}

Cube.prototype.getFaces = function() {
	return this._faces;
}

Cube.prototype.setFace = function(type, color) {
	if (!(type in this._faces)) {
		var face = new Face(this, type);
		this._node.appendChild(face.getNode());
		this._faces[type] = face;
	}
	this._faces[type].setColor(color);
}

Cube.prototype.setRotation = function(rotation, hasAnimation) {
	this._rotation = rotation
	this._update(hasAnimation ? 1200 : 1);
}

Cube.prototype.complete = function() {
	for (var i=0;i<6;i++) {
		if (i in this._faces) { continue; }
		this.addFace(i, "black");
	}
}

Cube.prototype.prepareColorChange = function(sourceCube, rotation) {
	this._tmpFaces = {};
	var sourceFaces = sourceCube.getFaces();
	for (var p in sourceFaces) { 
		var sourceType = parseInt(p);
		var targetType = this._rotateType(sourceType, rotation);
		this._tmpFaces[targetType] = sourceFaces[sourceType].getColor(); 
	}
}

Cube.prototype.commitColorChange = function() {
//	var parent = this._node.parentNode;
//	parent.removeChild(this._node);

	OZ.DOM.clear(this._node);
	this._faces = {};
	for (var p in this._tmpFaces) { 
		var type = parseInt(p);
		this.setFace(type, this._tmpFaces[p]); 
	}
	this._tmpFaces = {};
	
	this._rotation = null;
	this._update();
//	parent.appendChild(this._node);
}

Cube.prototype._rotateType = function(type, rotation) {
	for (var i=0;i<3;i++) {
		if (!rotation[i]) { continue; }
		var faces = Face.ROTATION[i];
		var index = faces.indexOf(type);
		if (index == -1) { continue; } /* no rotation available */
		index = (index + rotation[i] + faces.length) % faces.length;
		return faces[index];
	}
	
	return type;
}

Cube.prototype._update = function(rotationTime=300) {
	var transform = "";
	transform += "translate3d("+(-Face.SIZE/2)+"px, "+(-Face.SIZE/2)+"px, "+(-Face.SIZE/2)+"px) ";
	if (this._rotation) { transform += this._rotation + " "; }

	var half = Math.floor(Rubik.SIZE/2) - (Rubik.SIZE % 2 === 0 ? 1/2 : 0);
	var x = this._position[0];
	var y = this._position[1];
	var z = -this._position[2];
	x -= half;
	y -= half;
	z += half + 1/2;
	transform += "translate3d("+(x*Face.SIZE)+"px, "+(y*Face.SIZE)+"px, "+(z*Face.SIZE)+"px)";

	var prop = OZ.CSS3.getProperty("transform");
	// var val = this._rotation ? prop + " 300ms" : "";
	var val = this._rotation ? prop + ` ${rotationTime}ms` : "";
	// console.log("Rotation: ", this._rotation);
	// console.log("Val:", val);
	OZ.CSS3.set(this._node, "transition", val);

	OZ.CSS3.set(this._node, "transform", transform);
}

Cube.prototype.getPosition = function() {
	return this._position;
}

Cube.prototype.getNode = function() {
	return this._node;
}

Cube.prototype.getFaces = function() {
	return this._faces;
}

var Rubik = OZ.Class();
Rubik.SIZE = 3;
Rubik.prototype.init = function(rubik_window, rotationX=-20, rotationY=-30, init_state='YYYBBBRRRGGGOOOWWWYYYBBBRRRGGGOOOWWWYYYBBBRRRGGGOOOWWW') {
	this._init_state = init_state;
	this._cubes = [];
	this._faces = [];
	this._faceNodes = [];
	this._help = {};
	this._drag = {
		ec: [],
		mouse: [],
		face: null
	};
	
	this._rotation = Quaternion.fromRotation([1, 0, 0], rotationX).multiply(Quaternion.fromRotation([0, 1, 0], rotationY));
	this._node = OZ.DOM.elm("div", {position:"absolute", left:"50%", top:"55%", width:"0px", height:"0px"});
	// document.body.appendChild(this._node);

	// Add the Rubik's Cube Object in where the <script> tag is placed.
	// document.currentScript.parentNode.insertBefore(this._node, document.currentScript.nextSibling);
	rubik_window.innerHTML = "";
	rubik_window.appendChild(this._node);


	
	// OZ.CSS3.set(document.body, "perspective", "460px");
	OZ.CSS3.set(this._node, "transform-style", "preserve-3d");
	
	this._build();
	this._update();
	OZ.Event.add(document.body, "mousedown touchstart", this._dragStart.bind(this));
	
	// setTimeout(this.randomize.bind(this), 500);
}

Rubik.prototype.randomize = function() {
	var remain = 10;
	var cb = function() {
		remain--;
		if (remain > 0) { 
			this._rotateRandom();
		} else {
			OZ.Event.remove(e);
			
			this._help.a = OZ.DOM.elm("p", {innerHTML:"Drag or swipe the background to rotate the whole cube."});
			this._help.b = OZ.DOM.elm("p", {innerHTML:"Drag or swipe the cube to rotate its layers."});
			document.body.appendChild(this._help.a);
			document.body.appendChild(this._help.b);
			OZ.CSS3.set(this._help.a, "transition", "opacity 500ms");
			OZ.CSS3.set(this._help.b, "transition", "opacity 500ms");
			
		}
	}
	var e = OZ.Event.add(null, "rotated", cb.bind(this));
	this._rotateRandom();
}

Rubik.prototype._rotateRandom = function() {
	var method = "_rotate" + ["X", "Y", "Z"].random();
	var dir = [-1, 1].random();
	var layer = Math.floor(Math.random()*Rubik.SIZE);
	this[method](dir, layer);
}

Rubik.prototype._update = function() {
	OZ.CSS3.set(this._node, "transform", "translateZ(" + (-Face.SIZE/2 - Face.SIZE) + "px) " + this._rotation.toRotation() + " translateZ("+(Face.SIZE/2)+"px)");
}

Rubik.prototype._eventToFace = function(e) {
	if (document.elementFromPoint) {
		e = (e.touches ? e.touches[0] : e);
		var node = document.elementFromPoint(e.clientX, e.clientY);
	} else {
		var node = OZ.Event.target(e);
	}
	var index = this._faceNodes.indexOf(node);
	if (index == -1) { return null; }
	return this._faces[index];
}

Rubik.prototype._dragStart = function(e) {
	this._faces = [];
	this._faceNodes = [];
	for (var i=0;i<this._cubes.length;i++) {
		var faces = this._cubes[i].getFaces();
		for (var p in faces) {
			this._faces.push(faces[p]);
			this._faceNodes.push(faces[p].getNode());
		}
	}
	
	OZ.Event.prevent(e);
	// this._drag.face = this._eventToFace(e); // 原來是用來判斷是否drag中魔方，這裏改成判斷永遠drag不中魔方，只能移動視角
	this._drag.face = null;
	e = (e.touches ? e.touches[0] : e);
	this._drag.mouse = [e.clientX, e.clientY];
	
	this._drag.ec.push(OZ.Event.add(document.body, "mousemove touchmove", this._dragMove.bind(this)));
	this._drag.ec.push(OZ.Event.add(document.body, "mouseup touchend", this._dragEnd.bind(this)));
}

Rubik.prototype._dragMove = function(e) {
	if (e.touches && e.touches.length > 1) { return; }
	
	if (this._drag.face) { /* check second face for rotation */
		var thisFace = this._eventToFace(e);
		if (!thisFace || thisFace == this._drag.face) { return; }
		this._dragEnd();
		this._rotate(this._drag.face, thisFace);
	} else { /* rotate cube */
		e = (e.touches ? e.touches[0] : e);
		var mouse = [e.clientX, e.clientY];
		var dx = mouse[0] - this._drag.mouse[0];
		var dy = mouse[1] - this._drag.mouse[1];
		var norm = Math.sqrt(dx*dx+dy*dy);
		if (!norm) { return; }
		var N = [-dy/norm, dx/norm];
		
		this._drag.mouse = mouse;
		this._rotation = Quaternion.fromRotation([N[0], N[1], 0], norm/2).multiply(this._rotation);
		this._update();
	}
}

Rubik.prototype._dragEnd = function(e) {
	while (this._drag.ec.length) { OZ.Event.remove(this._drag.ec.pop()); }
	
	if (!this._drag.face && this._help.a) {
		this._help.a.style.opacity = 0;
		this._help.a = null;
	}
}

Rubik.prototype._rotate = function(face1, face2) {
	var t1 = face1.getType();
	var t2 = face2.getType();
	var pos1 = face1.getCube().getPosition();
	var pos2 = face2.getCube().getPosition();
	
	/* find difference between cubes */
	var diff = 0;
	var diffIndex = -1;
	for (var i=0;i<3;i++) {
		var d = pos1[i]-pos2[i];
		if (d) {
			if (diffIndex != -1) { return; } /* different in >1 dimensions */
			diff = (d > 0 ? 1 : -1);
			diffIndex = i;
		}
	}
	
	if (t1 == t2) { /* same face => diffIndex != -1 */
		switch (t1) {
			case Face.FRONT:
			case Face.BACK:
				var coef = (t1 == Face.FRONT ? 1 : -1);
				if (diffIndex == 0) { this._rotateY(coef*diff, pos1[1]); } else { this._rotateX(coef*diff, pos1[0]); }
			break;

			case Face.LEFT:
			case Face.RIGHT:
				var coef = (t1 == Face.LEFT ? 1 : -1);
				if (diffIndex == 2) { this._rotateY(-coef*diff, pos1[1]); } else { this._rotateZ(coef*diff, pos1[2]); }
			break;

			case Face.TOP:
			case Face.BOTTOM:
				var coef = (t1 == Face.TOP ? 1 : -1);
				if (diffIndex == 0) { this._rotateZ(-coef*diff, pos1[2]); } else { this._rotateX(-coef*diff, pos1[0]); }
			break;
		}
		return;
	}
	
	switch (t1) { /* different face => same cube, diffIndex == 1 */
		case Face.FRONT:
		case Face.BACK:
			var coef = (t1 == Face.FRONT ? 1 : -1);
			if (t2 == Face.LEFT) { this._rotateY(1 * coef, pos1[1]); }
			if (t2 == Face.RIGHT) { this._rotateY(-1 * coef, pos1[1]); }
			if (t2 == Face.TOP) { this._rotateX(1 * coef, pos1[0]); }
			if (t2 == Face.BOTTOM) { this._rotateX(-1 * coef, pos1[0]); }
		break;

		case Face.LEFT:
		case Face.RIGHT:
			var coef = (t1 == Face.LEFT ? 1 : -1);
			if (t2 == Face.FRONT) { this._rotateY(-1 * coef, pos1[1]); }
			if (t2 == Face.BACK) { this._rotateY(1 * coef, pos1[1]); }
			if (t2 == Face.TOP) { this._rotateZ(1 * coef, pos1[2]); }
			if (t2 == Face.BOTTOM) { this._rotateZ(-1 * coef, pos1[2]); }
		break;

		case Face.TOP:
		case Face.BOTTOM:
			var coef = (t1 == Face.TOP ? 1 : -1);
			if (t2 == Face.FRONT) { this._rotateX(-1 * coef, pos1[0]); }
			if (t2 == Face.BACK) { this._rotateX(1 * coef, pos1[0]); }
			if (t2 == Face.LEFT) { this._rotateZ(-1 * coef, pos1[2]); }
			if (t2 == Face.RIGHT) { this._rotateZ(1 * coef, pos1[2]); }
		break;
	}

}

Rubik.prototype._rotateX = function(dir, layer, hasAnimation=true) {
	var cubes = [];
	for (var i=0;i<Rubik.SIZE*Rubik.SIZE;i++) {
		cubes.push(this._cubes[layer + i*Rubik.SIZE]);
	}
	this._rotateCubes(cubes, [dir, 0, 0], hasAnimation);
}

Rubik.prototype._rotateY = function(dir, layer, hasAnimation=true) {
	var cubes = [];
	for (var i=0;i<Rubik.SIZE;i++) {
		for (var j=0;j<Rubik.SIZE;j++) {
			cubes.push(this._cubes[j + layer*Rubik.SIZE + i*Rubik.SIZE*Rubik.SIZE]);
		}
	}
	this._rotateCubes(cubes, [0, -dir, 0], hasAnimation);
}

Rubik.prototype._rotateZ = function(dir, layer, hasAnimation=true) {
	var cubes = [];
	var offset = layer * Rubik.SIZE * Rubik.SIZE;
	for (var i=0;i<Rubik.SIZE*Rubik.SIZE;i++) {
		cubes.push(this._cubes[offset+i]);
	}
	this._rotateCubes(cubes, [0, 0, dir], hasAnimation);
}

Rubik.prototype._rotateCubes = function(cubes, rotation, hasAnimation) {
	var suffixes = ["X", "Y", ""];
	
	var prefix = OZ.CSS3.getPrefix("transition");
	if (prefix === null) {
		this._finalizeRotation(cubes, rotation);
	} else {
		var cb = function() {
			OZ.Event.remove(e);
			this._finalizeRotation(cubes, rotation);
		}
		var e = OZ.Event.add(document.body, "webkitTransitionEnd transitionend MSTransitionEnd oTransitionEnd", cb.bind(this));

		var str = "";
		for (var i=0;i<3;i++) {
			if (!rotation[i]) { continue; }
			str = "rotate" + suffixes[i] + "(" + (90*rotation[i]) + "deg)";
		}
		for (var i=0;i<cubes.length;i++) { cubes[i].setRotation(str, hasAnimation); }
	}
	
}

/**
 * Remap colors
 */
Rubik.prototype._finalizeRotation = function(cubes, rotation) {
	var direction = 0;
	for (var i=0;i<3;i++) { 
		if (rotation[i]) { direction = rotation[i]; } 
	}
	
	if (rotation[0]) { direction *= -1; } /* FIXME wtf */
	
	var half = Math.floor(Rubik.SIZE/2) - (Rubik.SIZE % 2 === 0 ? 1/2 : 0);

	for (var i=0;i<cubes.length;i++) {
		var x = i % Rubik.SIZE - half;
		var y = Math.floor(i / Rubik.SIZE) - half;
		
		var source = [y*direction + half, -x*direction + half];
		var sourceIndex = source[0] + Rubik.SIZE*source[1];
		
		cubes[i].prepareColorChange(cubes[sourceIndex], rotation);
	}
	
	for (var i=0;i<cubes.length;i++) { cubes[i].commitColorChange(); }
	
	setTimeout(function() {
		if (this._help.b) {
			this._help.b.style.opacity = 0;
			this._help.b = null;
		}
		
		this.dispatch("rotated");
	}.bind(this), 100);
}

// Rubik.prototype._colors = `
// BYG RBG BRG RGB ROG BWG
// YYY BBB RRR GGG OOO WWW
// YYY BBB RRR GGG OOO WWW
// `.replace(/\s+/g, ""); // 去掉所有空格

Rubik._parseState = function(state_str) {
	return state_str.replace(/\s+/g, ""); // 去掉所有空格
}

// index 0 1 2 18 19 20 36 37 38 是黃色
// index 3 4 5 21 22 23 39 40 41 是藍色
// index 6 7 8 24 25 26 42 43 44 是紅色
// index 9 10 11 27 28 29 45 46 47 是綠色
// index 12 13 14 30 31 32 48 49 50 是橙色
// index 15 16 17 33 34 35 51 52 53是白色

//init_and_demonstrate([], [])

Rubik._parseColor = function(color_single) {
	switch(color_single) {
		case "Y": return "yellow";
		case "B": return "blue";
		case "R": return "red";
		case "G": return "green";
		case "O": return "orange";
		case "W": return "white";
		case "X": return "grey";
	}
	return null;
}

Rubik.prototype._build = function() {
	for (var z=0;z<Rubik.SIZE;z++) {
		for (var y=0;y<Rubik.SIZE;y++) {
			for (var x=0;x<Rubik.SIZE;x++) {
				var cube = new Cube([x, y, z]);
				this._cubes.push(cube);

				const inside = "grey";

				
				if (z == 0) {  // Blue Side
					cube.setFace(Face.FRONT, Rubik._parseColor(this._init_state[3 + x + y*18])); 
					cube.setFace(Face.BACK, inside); 
				} else if (z == 1) {
					cube.setFace(Face.FRONT, inside); 
					cube.setFace(Face.BACK, inside); 
				} else if (z == 2) { // Green Side
					cube.setFace(Face.BACK, Rubik._parseColor(this._init_state[9 + (2-x) + y*18])); 
					cube.setFace(Face.FRONT, inside); 
				}

				
				if (x == 0) { // Orange Side 
					cube.setFace(Face.LEFT, Rubik._parseColor(this._init_state[12 + (2-z) + y*18])); 
					cube.setFace(Face.RIGHT, inside); 
				} else if (x == 1) {
					cube.setFace(Face.LEFT, inside); 
					cube.setFace(Face.RIGHT, inside); 
				} else if (x == 2) { // Red Side
					cube.setFace(Face.RIGHT, Rubik._parseColor(this._init_state[6 + z + y*18])); 
					cube.setFace(Face.LEFT, inside); 
				}

				
				if (y == 0) { // Yellow Side
			 		cube.setFace(Face.TOP,  Rubik._parseColor(this._init_state[0 + x + (2-z)*18])); 
					cube.setFace(Face.BOTTOM, inside); 
				} else if (y == 1) {
					cube.setFace(Face.TOP, inside); 
					cube.setFace(Face.BOTTOM, inside); 
				} else if (y == 2) {  // White Side
					cube.setFace(Face.BOTTOM, Rubik._parseColor(this._init_state[15 + x + z*18])); 
					cube.setFace(Face.TOP, inside); 
				}
				
				// cube.complete();
				
				this._node.appendChild(cube.getNode());
			}
		}
	}

}

Rubik.prototype._execTurn = function(turn, hasAnimation=true) {
	// if (turn[1] == "2") {
	// 	turn = turn[0];
	// 	this._execTurn(turn);
	// }

	switch (turn) {
		case "R":  this._rotateX(1, 2, hasAnimation); break;
		case "R'": this._rotateX(-1, 2, hasAnimation); break;
		case "U":  this._rotateY(1, 0, hasAnimation); break;
		case "U'": this._rotateY(-1, 0, hasAnimation); break;
		case "F":  this._rotateZ(1, 0, hasAnimation); break;
		case "F'": this._rotateZ(-1, 0, hasAnimation); break;
		case "L":  this._rotateX(-1, 0, hasAnimation); break;
		case "L'": this._rotateX(1, 0, hasAnimation); break;
		case "D":  this._rotateY(-1, 2, hasAnimation); break;
		case "D'": this._rotateY(1, 2, hasAnimation); break;
		case "B":  this._rotateZ(-1, 2, hasAnimation); break;
		case "B'": this._rotateZ(1, 2, hasAnimation); break;
		case "M":  this._rotateX(-1, 1, hasAnimation); break;
		case "M'": this._rotateX(1, 1, hasAnimation); break;
		case "x": this._execTurn("R"); this._execTurn("L'"); this._execTurn("M'"); break;
		case "y": this._execTurn("R'"); this._execTurn("L"); this._execTurn("M"); break;
		case "l": this._execTurn("L"); this._execTurn("M"); break;
		case "l'": this._execTurn("L'"); this._execTurn("M'"); break;
		case "r": this._execTurn("R"); this._execTurn("M'"); break;
		case "r'": this._execTurn("R'"); this._execTurn("M"); break;
	}
}

Rubik.prototype._updateByAlgo = function(algoArr) {
	if (algoArr == void 0) return;
	for (var turn of algoArr) {
		this._execTurn(turn, false);
	}
}



// Rubik.prototype._showProgress = function() {
// 	this._help.a = OZ.DOM.elm("p", {innerHTML:"Drag or swipe the background to rotate the whole cube."});
// 	document.body.appendChild(this._help.a);
// 	OZ.CSS3.set(this._help.a, "position", "absolute");
// 	OZ.CSS3.set(this._help.a, "bottom", "20px");
// }

