# Very Array
### Array helper LINQ style

[![Build Status](https://travis-ci.org/nescalante/very-array.png?branch=master)](https://travis-ci.org/nescalante/very-array)

# Install

```shell
npm install very-array --save

bower install very-array
```

# Usage:

```shell
var va = require('very-array'); // only for server side

va([1,2,3]).where(function (i) { return i > 1; }); // [2, 3]
```

Functions:
* sum: 

    ```shell
    va([{ a: 1 }, { a: 2 }, { a: 3 }])
        .sum(function (i) { return i.a; }); // 6
    ```
    
* select: 
 
    ```shell
    va([{ a: 1 }, { a: 2 }, { a: 3 }])
        .select(function (i) { return i.a; }) // [1, 2, 3]
    ```

* selectMany: 

    ```shell
    va([{ a: [1, 2] }, { a: [3] }, { a: [4, 5, 6] }])
        .selectMany(function (i) { return i.a; }) // [1, 2, 3, 4, 5, 6]
    ```
    
* contains: 

    ```shell
    va([1, 2, 3])
        .contains(1); // true
    ```
    
* all: 

    ```shell
    va([1, 2, 3])
        .all(function (i) { return i > 0; }); // true
    ```
    
* any: 

    ```shell
    va([1, 2, 3])
        .any(function (i) { return i > 2; }); // true
    ```
    
* where: 

    ```shell
    va([1, 2, 3])
        .where(function (i) { return i > 2; }); // [3]
    ```
    
* first: 
    
    ```shell
    va([1, 2, 3])
        .first(function (i) { return i > 1; }); // [2]
    ```

* last: 
 
    ```shell
    va([1, 2, 3])
        .last(); // 3
    ```

* distinct: 
 
    ```shell
    va([1, 1, 2, 3, 3])
        .distinct(); // [1, 2, 3]
    ```

* groupBy: 
 
    ```shell
    va([{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }])
        .groupBy(function (i) { return i.a; }); //Array[2], Array[1], Array[1]
    ```

* orderBy: 

    ```shell
    va([{ a: 2 }, { a: 1 }, { a: 3 }])
        .orderBy(function (i) { return i.a; }); // [{ a: 1 }, { a: 2 }, { a: 3 }]
    ```
    
* orderByDescending: 

    ```shell
    va([{ a: 1 }, { a: 2 }, { a: 3 }])
        .orderByDescending(function (i) { return i.a; }); // [{ a: 3 }, { a: 2 }, { a: 1 }]
    ```
    
* each: 

    ```shell
    va([1, 2, 3])
        .each(function (index, item) { console.log(item) }); // 1, 2, 3
    ```
