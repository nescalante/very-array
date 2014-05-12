var assert = require('assert');
var va = require('../src/very-array.js');

assert.falsy = function (value, message) { assert.equal(false, !!value, message); };

describe('toArray()', function () {
  it('should return an Array', function () {
    assert.deepEqual(va([1, 2, 3]).toArray(), [1, 2, 3]);
  });
});

describe('where()', function () {
  it('should filter elements', function () {
    var condition = function (i) { return i > 2; };
    var result = va([1, 2, 3, 4, 5])
      .where(condition)
      .toArray();

    for (var i = 0; i < result.length; i++) {
      assert.equal(condition(result[i]), true);
    }

    assert.deepEqual(result, [3, 4, 5]);
  });
});

describe('skip()', function () {
  it('should skip some numbers', function () {
    assert.deepEqual(va([1, 2, 3, 4]).skip(1).toArray(), [2, 3, 4]);
    assert.deepEqual(va([1, 2, 3]).skip(4).toArray(), []);
  });
});

describe('take()', function () {
  it('should take some numbers', function () {
    assert.deepEqual(va([1, 2, 3, 4]).take(2).toArray(), [1, 2]);
    assert.deepEqual(va([1, 2]).take(4).toArray(), [1, 2]);
  });
});

describe('sum()', function () {
  it('should sum some numbers', function () {
    assert.equal(va([{ a: 1 }, { a: 2 }, { a: 3 }]).sum(function (i) { return i.a; }), 6);
    assert.equal(va([1, 2]).sum(), 3);
  });
});

describe('select()', function () {
  it('should select elements specific attributes', function () {
    var result = va([{ a: 1 }, { a: 2 }, { a: 3 }])
      .select(function (i) { return i.a; })
      .toArray();

    assert.deepEqual(result, [1, 2, 3]);
  });
});

describe('selectMany()', function () {
  it('should select inner elements from an array of arrays', function () {
    var result = va([{ a: [1, 2] }, { a: [3] }, { a: [4, 5, 6] }])
      .selectMany(function (i) { return i.a; })
      .toArray();

    assert.deepEqual(result, [1, 2, 3, 4, 5, 6]);
  });
});

describe('contains()', function () {
  it('should return true if an element is inside an array', function () {
    assert.ok(va([1, 2, 3]).contains(3));
    assert.falsy(va([3, 4, 5]).contains(6));
  });
});

describe('all()', function () {
  it('should return true if all elements satisfy condition', function () {
    assert.ok(va([1, 2, 3]).all(function (i) { return i > 0; }));
    assert.falsy(va([1, 2, 3]).all(function (i) { return i < 2; }));
  });
});

describe('any()', function () {
  it('should return true if at least one element satisfy condition', function () {
    assert.ok(va([1, 2, 3]).any(function (i) { return i < 2; }));
    assert.falsy(va([1, 2, 3]).any(function (i) { return i > 5; }));
  });
});

describe('first()', function () {
  it('should return the first element of an array satisfying condition', function () {
    assert.equal(va([1, 2, 3]).first(), 1);
    assert.equal(va([1, 2, 3]).first(function (i) { return i > 2; }), 3);
  });
});

describe('last()', function () {
  it('should return the last element of an array satisfying condition', function () {
    assert.equal(va([1, 2, 3]).last(), 3);
    assert.equal(va([1, 2, 3]).last(function (i) { return i < 3; }), 2);
  });
});

describe('distinct()', function () {
  it('should not return a number twice', function () {
    var result = va([1, 1, 2, 2, 3, 3])
      .distinct()
      .toArray();

    assert.deepEqual(result, [1, 2, 3]);
  });

  it('should not return an object twice', function () {
    var result = va([{ a: 1 }, { a: 1 }, { a: 1, b: 2 }, { b: 2 }])
      .distinct()
      .toArray();

    assert.deepEqual(result, [{ a: 1 }, { a: 1, b: 2 }, { b: 2 }]);
  });
});

describe('groupBy()', function () {
  it('should return a new array grouped by expression given', function () {
    var result = va([{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }])
      .groupBy(function (i) { return i.a; })
      .toArray();

    assert.deepEqual(result, [[{ a: 1 }, { a: 1 }], [{ a: 2 }], [{ a: 3 }]]);
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

    assert.deepEqual(numbers, [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    assert.deepEqual(letters, [{ a: "a" }, { a: "x" }, { a: "y" }, { a: "z" }]);
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

    assert.deepEqual(numbers, [{ a: 4 }, { a: 3 }, { a: 2 }, { a: 1 }]);
    assert.deepEqual(letters, [{ a: "z" }, { a: "y" }, { a: "x" }, { a: "a" }]);
  });
});

describe('forEach()', function () {
  it('should do something for each element on an array', function () {
    var result = va([{}, {}, {}])
      .forEach(function (i, ix) {
        i.a = ix;
      })
      .toArray();

    assert.deepEqual(result, [{ a: 0 }, { a: 1 }, { a: 2 }]);
  });
});

describe('concatenation', function () {
  it('should do some actions concatenated', function () {
    var result = va([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 3 }, { a: 4 }])
      .where(function (i) { return i.a < 4; })
      .distinct()
      .sum(function (i) { return i.a; });

    assert.equal(result, 6);
  });
});

describe('extension', function () {
  it('should extend Array element', function () {
    va.extends(Array);

    var sum = [{ a: 1 }, { a: 2 }, { a: 3 }].sum(function (i) { return i.a; });

    // some tests just to ensure
    assert.equal(sum, 6);
    assert.equal([2, 3].sum(), 5);
    assert.equal([1, 2, 3].first(), 1);
    assert.equal([1, 2, 3].last(), 3);
    assert.deepEqual([1, 1, 1].distinct(), [1]);
    assert.deepEqual([1, 2, 3].where(function (i) { return i < 3; }), [1, 2]);
    assert.deepEqual([1, 2, 3].take(2), [1, 2]);
    assert.deepEqual([1, 2, 3].skip(2), [3]);

    var concat = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 3 }, { a: 4 }]
      .where(function (i) { return i.a < 4; })
      .distinct()
      .sum(function (i) { return i.a; });

    assert.equal(concat, 6);
  });
});