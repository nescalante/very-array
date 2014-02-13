(function (root) {
	var q;

	function Query() {
		var self = this;

		for (var i = 0; i < arguments.length; i++) {
			if (arguments[i] instanceof Array) {
				self.push.apply(self, arguments[i]);
			}
			else {
				self.push(arguments[i]);
			}
		}

		// assign functions;
		self.sum = _sum;
		self.select = _select;
		self.selectMany = _selectMany;
		self.contains = _contains;
		self.all = _all;
		self.any = _any;
		self.where = _where;
		self.first = _first;
		self.last = _last;
		self.distinct = _distinct;
		self.groupBy = _groupBy;
		self.orderBy = _orderBy;
		self.orderByDescending = _orderByDescending;

		function _sum(selector) {
			var totalSum = 0;

			for (var i = 0; i < self.length; i++) {
				totalSum += selector(self[i]);
			}

			return totalSum;
		};

		function _select(selector) {
			var array = [];

			for (var i = 0; i < self.length; i++) {
				array.push(selector(self[i]));
			}

			return new Query(array);
		};

		function _selectMany(selector) {
			var array = [];

			for (var i = 0; i < self.length; i++) {
				var innerArray = selector(self[i]);
				if (innerArray.length) {
					for (var j = 0; j < innerArray.length; j++) {
						array.push(innerArray[j]);
					}
				}
			}

			return new Query(array);
		};

		function _contains(item) {
			for (var i = 0; i < self.length; i++) {
				if (self[i] === item) {
					return true;
				}
			}

			return false;
		};

		 function _all(expression) {
			var success = true;

			for (var i = 0; i < self.length; i++) {
				success = success && expression(self[i]);
			}

			return success;
		};

		function _any(expression) {
			if (expression === undefined) {
				return self.length > 0;
			}

			for (var i = 0; i < self.length; i++) {
				if (expression(self[i])) {
					return true;
				}
			}

			return false;
		};

		function _where(expression) {
			var array = [];

			for (var i = 0; i < self.length; i++) {
				if (expression(self[i])) {
					array.push(self[i]);
				}
			}

			return new Query(array);
		};

		function _first(expression) {
			if (expression == null) {
				return self.length > 0 ? self[0] : null;
			}

			var result = self.where(expression);

			return result.length > 0 ? result[0] : null;
		};

		function _last(expression) {
			if (expression == null) {
				return self.length > 0 ? self[self.length - 1] : null;
			}

			var result = self.where(expression);

			return result.length > 0 ? result[result.length - 1] : null;
		};

		function _distinct() {
			var array = [];

			if (self.any() && self.all(function (i) { return i == null; })) {
				return [null];
			}

			for (var i = 0; i < self.length; i++) {
				var item = array.first(function (n) { return bchz.util.equal(n, self[i]); });
				if (item === null) {
					array.push(self[i]);
				}
			}

			return new Query(array);
		};

		function _groupBy(selector) {
			var array = [];

			for (var i = 0; i < self.length; i++) {
				var item = array.first(function (n) { return bchz.util.equal(n.key, selector(self[i])); });
				if (item === null) {
					item = [];
					item.key = selector(self[i]);
					array.push(item);
				}

				item.push(self[i]);
			}

			return new Query(array);
		};

		function _getType(selector) {
			if (self.length == 0) return "undefined";

			for (var i = 0; i < self.length; i++) {
				var type = typeof selector(self[i]);
				if (type == "number") return "number";
				if (type == "string") return "string";
				if (type == "boolean") return "boolean";
				if (selector(self[i]) instanceof Date) return "Date";
			}

			return "undefined";
		};

		function _orderBy(selector) {
			if (self.length == 0) return [];

			var type = _getType(selector),
				result;

			if (type == "number") {
				result = self.sort(function (a, b) { return selector(a) - selector(b); });
			}
			else if (type == "string") {
				result = self.sort(function (a, b) {
					var x = selector(a) || "",
						y = selector(b) || "";

					return x < y ? -1 : (x > y ? 1 : 0);
				});
			}
			else if (type == "boolean") {
				result = self.sort(function (a, b) { return selector(a) == selector(b) ? 1 : -1 });
			}
			else if (type == "Date") {
				result = self.sort(function (a, b) { return (selector(a) || new Date(0)).getTime() - (selector(b) || new Date(0)).getTime(); });
			}
			else {
				result = self;
			}

			return new Query(result);
		};

		function _orderByDescending(selector) {
			if (self.length == 0) return [];

			var type = _getType(selector),
				result;

			if (type == "number") {
				result = self.sort(function (b, a) { return selector(a) - selector(b); });
			}
			else if (type == "string") {
				result = self.sort(function (b, a) {
					var x = selector(a) || "",
						y = selector(b) || "";

					return x < y ? -1 : (x > y ? 1 : 0);
				});
			}
			else if (type == "boolean") {
				result = self.sort(function (b, a) { return selector(a) == selector(b) ? -1 : 1 });
			}
			else if (type == "Date") {
				result = self.sort(function (b, a) { return (selector(a) || new Date(0)).getTime() - (selector(b) || new Date(0)).getTime(); });
			}
			else {
				result = self;
			}

			return new Query(result);
		};

		function _each(action) {
			for (var i = 0; i < self.length; i++) {
				action.bind(self[i], i, self[i])();
			}

			return self;
		};
	}

	Query.prototype = clone(Array.prototype);
 	q = function () { return construct(Query, arguments); };

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = q;
	}
	else {
		root.va = q;
	}

	function clone(obj) {
		function F() { }
		F.prototype = obj;
		
		return new F();
	}

	function construct(constructor, args) {
		function F() {
			return constructor.apply(this, args);
		}

		F.prototype = constructor.prototype;

		return new F();
	}
})(this);