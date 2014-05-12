(function (root) {
  'use strict';
  
  var q;
  var functions = ['skip', 'take', 'sum', 'select', 'selectMany', 'contains', 'all', 'any', 'where', 'first', 'last', 'distinct', 'groupBy', 'orderBy', 'orderByDescending', 'forEach'];

  function Query() {
    var self = this;

    // whatever array or comma-separated is ok
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] instanceof Array) {
        self.push.apply(self, arguments[i]);
      }
      else {
        self.push(arguments[i]);
      }
    }

    // assign functions;
    self.skip = _skip;
    self.take = _take;
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
    self.forEach = _forEach;
    self.toArray = _toArray;

    function _query(type, result) {
      return type instanceof Query ? new Query(result) : result;
    }

    function _skip(count) {
      var array = [];
      
      for (var i = count; i < self.length; i++) {
        if (i < self.length) {
          array.push(self[i]);
        }
      }

      return _query(this, array);
    }

    function _take(count) {
      var array = [];
      
      for (var i = 0; i < count; i++) {
        if (i < self.length) {
          array.push(self[i]);
        }
      }

      return _query(this, array);
    }

    function _sum(selector) {
      var sum = 0;

      for (var i = 0; i < self.length; i++) {
        sum += (selector && selector(self[i])) || self[i];
      }

      return sum;
    }

    function _select(selector) {
      var array = [];

      for (var i = 0; i < self.length; i++) {
        array.push(selector(self[i]));
      }

      return _query(this, array);
    }

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

      return _query(this, array);
    }

    function _contains(item) {
      for (var i = 0; i < self.length; i++) {
        if (self[i] === item) {
          return true;
        }
      }

      return false;
    }

     function _all(expression) {
      var success = true;

      for (var i = 0; i < self.length; i++) {
        success = success && expression(self[i]);
      }

      return success;
    }

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
    }

    function _where(expression) {
      var array = [];

      for (var i = 0; i < self.length; i++) {
        if (expression(self[i])) {
          array.push(self[i]);
        }
      }

      return _query(this, array);
    }

    function _first(expression) {
      if (expression === null || expression === undefined) {
        return self.length > 0 ? self[0] : null;
      }

      var result = self.where(expression);

      return result.length > 0 ? result[0] : null;
    }

    function _last(expression) {
      if (expression === null || expression === undefined) {
        return self.length > 0 ? self[self.length - 1] : null;
      }

      var result = self.where(expression);

      return result.length > 0 ? result[result.length - 1] : null;
    }

    function _distinct() {
      var query = new Query([]);

      if (self.any() && self.all(function (i) { return i === null || i === undefined; })) {
        return [null];
      }

      for (var i = 0; i < self.length; i++) {
        var item = query.first(compareItem(i));
        if (item === null) {
          query.push(self[i]);
        }
      }

      return this instanceof Query ? query : query.toArray();

      function compareItem(i) { 
        return function(n) { return _equal(n, self[i]); };
      }
    }

    function _groupBy(selector) {
      var query = new Query([]);

      for (var i = 0; i < self.length; i++) {
        var item = query.first(compareItem(i));
        if (item === null) {
          item = new Query([]);
          item.key = selector(self[i]);
          query.push(item);
        }

        item.push(self[i]);
      }

      return this instanceof Query ? query : query.toArray();

      function compareItem(i) {
        return function (n) { return _equal(n.key, selector(self[i])); };
      }
    }

    function _getType(selector) {
      if (self.length === 0) return 'undefined';

      for (var i = 0; i < self.length; i++) {
        var type = typeof selector(self[i]);
        if (type == 'number') return 'number';
        if (type == 'string') return 'string';
        if (type == 'boolean') return 'boolean';
        if (selector(self[i]) instanceof Date) return 'Date';
      }

      return 'undefined';
    }

    function _orderBy(selector) {
      if (self.length === 0) return new Query([]);

      var type = _getType(selector),
        result;

      if (type == 'number') {
        result = self.sort(function (a, b) { return selector(a) - selector(b); });
      }
      else if (type == 'string') {
        result = self.sort(function (a, b) {
          var x = selector(a) || '',
            y = selector(b) || '';

          return x < y ? -1 : (x > y ? 1 : 0);
        });
      }
      else if (type == 'boolean') {
        result = self.sort(function (a, b) { return selector(a) == selector(b) ? 1 : -1; });
      }
      else if (type == 'Date') {
        result = self.sort(function (a, b) { return (selector(a) || new Date(0)).getTime() - (selector(b) || new Date(0)).getTime(); });
      }
      else {
        result = self;
      }

      return _query(this, result);
    }

    function _orderByDescending(selector) {
      if (self.length === 0) return new Query([]);

      var type = _getType(selector),
        result;

      if (type == 'number') {
        result = self.sort(function (b, a) { return selector(a) - selector(b); });
      }
      else if (type == 'string') {
        result = self.sort(function (b, a) {
          var x = selector(a) || '',
            y = selector(b) || '';

          return x < y ? -1 : (x > y ? 1 : 0);
        });
      }
      else if (type == 'boolean') {
        result = self.sort(function (b, a) { return selector(a) == selector(b) ? -1 : 1; });
      }
      else if (type == 'Date') {
        result = self.sort(function (b, a) { return (selector(a) || new Date(0)).getTime() - (selector(b) || new Date(0)).getTime(); });
      }
      else {
        result = self;
      }

      return _query(this, result);
    }

    function _forEach(action) {
      for (var i = 0; i < self.length; i++) {
        action.bind(self[i], self[i], i)();
      }

      return self;
    }

    function _toArray() {
      return converyArray(self);

      function converyArray(array) {
        var result = [];

        for (var i = 0; i < array.length; i++) {
          if (array[i] instanceof Query) {
            result.push(converyArray(array[i]));
          }
          else {
            result.push(array[i]);
          }
        }

        return result;
      }
    }

    function _equal (c, x) {
      // date compare
      if (c instanceof Date && x instanceof Date) {
        return c.getTime() == x.getTime();
      }

      if (c instanceof Date != x instanceof Date) {
        return false;
      }

      // type compare
      if (typeof c !== typeof x) {
        return false;
      }

      // number or string compare
      if (typeof c === 'number' || typeof c === 'string') {
        return c === x;
      }

      // both undefined
      if (typeof c === 'undefined') {
        return true;
      }

      // object properties compare
      for (var key1 in c) {
        if (c[key1] !== x[key1]) {
          return false;
        }
      }

      // check the other object too
      for (var key2 in x) {
        if (c[key2] !== x[key2]) {
          return false;
        }
      }

      // all seems to be right
      return true;
    }
  }

  // array inheritance
  Query.prototype = clone(Array.prototype);
  q = function () { return construct(Query, arguments); };

  // prototype extension so you can va.extends(Array) or whateva
  q.extends = extend;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = q;
  }
  else {
    root.va = q;
  }

  function extend(obj) {
    q(functions).forEach(function (name) {
      obj.prototype[name] = obj.prototype[name] || function () { 
        var args = Array.prototype.slice
          .call(arguments);

        return q(this)[name].apply(this, args); 
      };
    });
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