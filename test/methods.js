var assert = require('assert');
var va = require('../src/very-array.js');

assert.falsy = function (value, message) { assert.equal(false, !!value, message); };

describe('toArray()', function () {
  it('should return an Array', function () {
    assert.deepEqual(va([1, 2, 3]).toArray(), [1, 2, 3]);
    assert.deepEqual(va.toArray([1, 2, 3]), [1, 2, 3]);
  });
});

describe('where()', function () {
  it('should filter elements', function () {
    var condition = function (i) { return i > 2; };
    var result = va([1, 2, 3, 4, 5])
      .where(condition)
      .toArray();

    var shortWay = va.where([1, 2, 3, 4, 5], condition).toArray();

    for (var i = 0; i < result.length; i++) {
      assert.equal(condition(result[i]), true);
      assert.equal(condition(shortWay[i]), true);
    }

    assert.deepEqual(shortWay, [3, 4, 5]);
  });
});

describe('sum()', function () {
  it('should sum some numbers', function () {
    assert.equal(va([{ a: 1 }, { a: 2 }, { a: 3 }]).sum(function (i) { return i.a; }), 6);
    assert.equal(va.sum([{ a: 1 }, { a: 2 }, { a: 3 }], function (i) { return i.a; }), 6);
  });
});

describe('select()', function () {
  it('should select elements specific attributes', function () {
    var result = va([{ a: 1 }, { a: 2 }, { a: 3 }])
      .select(function (i) { return i.a; })
      .toArray();

    var shortWay = va.select([{ a: 1 }, { a: 2 }, { a: 3 }], function (i) { return i.a; }).toArray();

    assert.deepEqual(result, [1, 2, 3]);
    assert.deepEqual(shortWay, [1, 2, 3]);
  });
});

describe('selectMany()', function () {
  it('should select inner elements from an array of arrays', function () {
    var result = va([{ a: [1, 2] }, { a: [3] }, { a: [4, 5, 6] }])
      .selectMany(function (i) { return i.a; })
      .toArray();

    var shortWay = va.selectMany([{ a: [1, 2] }, { a: [3] }, { a: [4, 5, 6] }], function (i) { return i.a; }).toArray();

    assert.deepEqual(result, [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(shortWay, [1, 2, 3, 4, 5, 6]);
  });
});

describe('contains()', function () {
  it('should return true if an element is inside an array', function () {
    assert.ok(va([1, 2, 3]).contains(3));
    assert.falsy(va([3, 4, 5]).contains(6));

    assert.ok(va.contains([1, 2, 3], 3));
    assert.falsy(va.contains([3, 4, 5], 6));
  });
});

describe('all()', function () {
  it('should return true if all elements satisfy condition', function () {
    assert.ok(va([1, 2, 3]).all(function (i) { return i > 0; }));
    assert.falsy(va([1, 2, 3]).all(function (i) { return i < 2; }));
    
    assert.ok(va.all([1, 2, 3], function (i) { return i > 0; }));
    assert.falsy(va.all([1, 2, 3], function (i) { return i < 2; }));
  });
});

describe('any()', function () {
  it('should return true if at least one element satisfy condition', function () {
    assert.ok(va([1, 2, 3]).any(function (i) { return i < 2; }));
    assert.falsy(va([1, 2, 3]).any(function (i) { return i > 5; }));
    
    assert.ok(va.any([1, 2, 3], function (i) { return i < 2; }));
    assert.falsy(va.any([1, 2, 3], function (i) { return i > 5; }));
  });
});

describe('first()', function () {
  it('should return the first element of an array satisfying condition', function () {
    assert.equal(va([1, 2, 3]).first(), 1);
    assert.equal(va([1, 2, 3]).first(function (i) { return i > 2; }), 3);
    assert.equal(va.first([1, 2, 3]), 1);
  });
});

describe('last()', function () {
  it('should return the last element of an array satisfying condition', function () {
    assert.equal(va([1, 2, 3]).last(), 3);
    assert.equal(va([1, 2, 3]).last(function (i) { return i < 3; }), 2);
    assert.equal(va.last([1, 2, 3]), 3);
  });
});

describe('distinct()', function () {
  it('should not return a number twice', function () {
    var result = va([1, 1, 2, 2, 3, 3])
      .distinct()
      .toArray();

    assert.deepEqual(result, [1, 2, 3]);
    assert.deepEqual(va.distinct([1, 1, 2, 2, 3, 3]).toArray(), [1, 2, 3]);
  });

  it('should not return an object twice', function () {
    var result = va([{ a: 1 }, { a: 1 }, { a: 1, b: 2 }, { b: 2 }])
      .distinct()
      .toArray();

    assert.deepEqual(result, [{ a: 1 }, { a: 1, b: 2 }, { b: 2 }]);
    assert.deepEqual(va.distinct([{ a: 1 }, { a: 1 }, { a: 1, b: 2 }, { b: 2 }]).toArray(), [{ a: 1 }, { a: 1, b: 2 }, { b: 2 }]);
  });
});

describe('groupBy()', function () {
  it('should return a new array grouped by expression given', function () {
    var result = va([{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }])
      .groupBy(function (i) { return i.a; })
      .toArray();

    var shortWay = va.groupBy([{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }], function (i) { return i.a; }).toArray();

    assert.deepEqual(result, [[{ a: 1 }, { a: 1 }], [{ a: 2 }], [{ a: 3 }]]);
    assert.deepEqual(shortWay, [[{ a: 1 }, { a: 1 }], [{ a: 2 }], [{ a: 3 }]]);
  });
});

describe('orderBy()', function () {
  it('should return a new sorted array by expression given', function () {
    var numbers = va([{ a: 3 }, { a: 4 }, { a: 2 }, { a: 1 }])
      .orderBy(function (i) { return i.a; })
      .toArray();
    
    var letters = va([{ a: "z" }, { a: "x" }, { a: "y" }, { a: "a" }])
      .orderBy(function (i) { return i.a; })
      .toArray();

    var shortWay = va.orderBy([{ a: 3 }, { a: 4 }, { a: 2 }, { a: 1 }], function (i) { return i.a; }).toArray();

    assert.deepEqual(numbers, [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    assert.deepEqual(letters, [{ a: "a" }, { a: "x" }, { a: "y" }, { a: "z" }]);
    assert.deepEqual(shortWay, [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
  });
});

describe('orderByDescending()', function () {
  it('should return a new inverse sorted array by expression given', function () {
    var numbers = va([{ a: 3 }, { a: 4 }, { a: 2 }, { a: 1 }])
      .orderByDescending(function (i) { return i.a; })
      .toArray();
    
    var letters = va([{ a: "z" }, { a: "x" }, { a: "y" }, { a: "a" }])
      .orderByDescending(function (i) { return i.a; })
      .toArray();

    var shortWay = va.orderByDescending([{ a: 3 }, { a: 4 }, { a: 2 }, { a: 1 }], function (i) { return i.a; }).toArray();

    assert.deepEqual(numbers, [{ a: 4 }, { a: 3 }, { a: 2 }, { a: 1 }]);
    assert.deepEqual(letters, [{ a: "z" }, { a: "y" }, { a: "x" }, { a: "a" }]);
    assert.deepEqual(shortWay, [{ a: 4 }, { a: 3 }, { a: 2 }, { a: 1 }]);
  });
});

describe('each()', function () {
  it('should do something for each element on an array', function () {
    var result = va([{}, {}, {}])
      .each(function (i, ix) {
        i.a = ix;
      })
      .toArray();

    var shortWay = va.each([{}, {}, {}], function (i, ix) {
        i.a = ix;
      }).toArray();

    assert.deepEqual(result, [{ a: 0 }, { a: 1 }, { a: 2 }]);
    assert.deepEqual(shortWay, [{ a: 0 }, { a: 1 }, { a: 2 }]);
  });
});