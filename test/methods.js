var assert = require('assert');
var va = require('../src/very-array.js');

assert.falsy = function (value, message) { a.equal(false, !!value, message); };

describe('where()', function () {
  it('should filter elements', function () {
    var condition = function (i) { return i > 2; };
    var result = va([1, 2, 3, 4, 5])
      .where(condition);

    for (var i = 0; i < result.length; i++) {
      assert.equal(condition(result[i]), true);
    }
  });
});

describe('sum()', function () {
  it('should filter elements', function () {
    var result = va([{ a: 1 }, { a: 2 }, { a: 3 }])
      .sum(function (i) { return i.a; });

    assert.equal(result, 6);
  });
});