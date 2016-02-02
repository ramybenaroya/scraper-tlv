if (typeof Number.prototype.map === 'undefined') {
	Number.prototype.map = function(mapper, context){
		var array = [];
		for (var i = 0; i < this; i++) {
			array.push(i);
		}

		return array.map(function(i){
			return mapper.call(context || null, i, i);
		});
	};
}


if (typeof Number.prototype.forEach === 'undefined') {
	Number.prototype.forEach = function(eachFunc, context){
		var array = [];
		for (var i = 0; i < this; i++) {
			array.push(i);
		}

		return array.forEach(function(i){
			return eachFunc.call(context || null, i, i);
		});
	};
}

module.exports = Number;