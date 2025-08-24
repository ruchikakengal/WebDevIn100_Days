OZ.CSS3 = { 
	getProperty: function(property) {
		var prefix = this.getPrefix(this._normalize(property));
		if (prefix === null) { return null; }
		return (prefix ? "-" + prefix.toLowerCase() + "-" : "") + property;
	},
	set: function(node, prop, value) {
		prop = this._normalize(prop);
		var prefix = this.getPrefix(prop);
		if (prefix === null) { return false; }
		var p = (prefix ? prefix + prop.charAt(0).toUpperCase() + prop.substring(1) : prop);
		node.style[p] = value;
		return true;
	},
	getPrefix: function(property) {
		var prefixes = ["", "ms", "Webkit", "O", "Moz"];
		for (var i=0;i<prefixes.length;i++) {
			var p = prefixes[i];
			var prop = (p ? p + property.charAt(0).toUpperCase() + property.substring(1) : property);
			if (prop in this._node.style) { return p; }
		}
		return null;
	},
	_normalize: function(property) {
		return property.replace(/-([a-z])/g, function(match, letter) { return letter.toUpperCase(); });
	},
	_node: OZ.DOM.elm("div")
}
