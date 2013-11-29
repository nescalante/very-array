linq.js
=======

Usage:

`[1,2,3].where(function (i) { return i > 1; }); // [2, 3]` 

Functions:
* sum: 

    `[{ a: 1 }, { a: 2 }, { a: 3 }].sum(function (i) { return i.a; }); // 6` 
    
* select: 
 
    `[{ a: 1 }, { a: 2 }, { a: 3 }].select(function (i) { return i.a; }) // [1, 2, 3]`

* selectMany: 

    `[{ a: [1, 2] }, { a: [3] }, { a: [4, 5, 6] }].selectMany(function (i) { return i.a; }) // [1, 2, 3, 4, 5, 6]`
    
* contains: 

    `[1, 2, 3].contains(1); // true`
    
* all: 

    `[1, 2, 3].all(function (i) { return i > 0; }); // true`
    
* any: 

    `[1, 2, 3].any(function (i) { return i > 2; }); // true`
    
* where: 

    `[1, 2, 3].where(function (i) { return i > 2; }); // [3]`
    
* first: 
    
    `[1, 2, 3].first(function (i) { return i > 1; }); // [2]`

* last: 
 
    `[1, 2, 3].last(); // 3`

* distinct: 
 
    `[1, 1, 2, 3, 3].distinct(); // [1, 2, 3]`

* groupBy: 
 
    `[{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }].groupBy(function (i) { return i.a; }); //Array[2], Array[1], Array[1]`

* indexOf: 

    `[1, 2, 3].indexOf(2); // 1`
    
* orderBy: 

    `[{ a: 2 }, { a: 1 }, { a: 3 }].orderBy(function (i) { return i.a; }); // [{ a: 1 }, { a: 2 }, { a: 3 }]`
    
* orderByDescending: 

    `[{ a: 1 }, { a: 2 }, { a: 3 }].orderByDescending(function (i) { return i.a; }); // [{ a: 3 }, { a: 2 }, { a: 1 }]`
    
* each: 

    `[1, 2, 3].each(function (index, item) { console.log(item) }); // 1, 2, 3`
