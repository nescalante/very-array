![Such array library](https://raw.github.com/nescalante/very-array/master/resources/such-dog.jpg)

# Very Array [![Build Status](https://travis-ci.org/nescalante/very-array.svg?branch=master)](https://travis-ci.org/nescalante/very-array) [![Greenkeeper badge](https://badges.greenkeeper.io/nescalante/very-array.svg)](https://greenkeeper.io/)

*Such functional array helper*

# Install

```shell
npm install very-array --save

bower install very-array
```

Many functions:
* skip: 

    ```js
    va([1, 2, 3])
        .skip(1); // [2, 3]
    ```

* take: 

    ```js
    va([1, 2, 3])
        .take(2); // [1, 2]
    ```

* sum: 

    ```js
    va([{ a: 1 }, { a: 2 }, { a: 3 }])
        .sum(function (i) { return i.a; }); // 6
    ```
    
* select: 
 
    ```js
    va([{ a: 1 }, { a: 2 }, { a: 3 }])
        .select(function (i) { return i.a; }) // [1, 2, 3]
    ```

* selectMany: 

    ```js
    va([{ a: [1, 2] }, { a: [3] }, { a: [4, 5, 6] }])
        .selectMany(function (i) { return i.a; }) // [1, 2, 3, 4, 5, 6]
    ```
    
* contains: 

    ```js
    va([1, 2, 3])
        .contains(1); // true
    ```
    
* all: 

    ```js
    va([1, 2, 3])
        .all(function (i) { return i > 0; }); // true
    ```
    
* any: 

    ```js
    va([1, 2, 3])
        .any(function (i) { return i > 2; }); // true
    ```
    
* where: 

    ```js
    va([1, 2, 3])
        .where(function (i) { return i > 2; }); // [3]
    ```
    
* first: 
    
    ```js
    va([1, 2, 3])
        .first(function (i) { return i > 1; }); // [2]
    ```

* last: 
 
    ```js
    va([1, 2, 3])
        .last(); // 3
    ```

* distinct: 
 
    ```js
    va([1, 1, 2, 3, 3])
        .distinct(); // [1, 2, 3]
    ```

* groupBy: 
 
    ```js
    va([{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }])
        .groupBy(function (i) { return i.a; }); //Array[2], Array[1], Array[1]
    ```

* orderBy: 

    ```js
    va([{ a: 2 }, { a: 1 }, { a: 3 }])
        .orderBy(function (i) { return i.a; }); // [{ a: 1 }, { a: 2 }, { a: 3 }]
    ```
    
* orderByDescending: 

    ```js
    va([{ a: 1 }, { a: 2 }, { a: 3 }])
        .orderByDescending(function (i) { return i.a; }); // [{ a: 3 }, { a: 2 }, { a: 1 }]
    ```
    
* forEach: 

    ```js
    va([1, 2, 3])
        .forEach(function (item, index) { console.log(item) }); // 1, 2, 3
    ```

Such prototype extension:

```js
va.extends(Array);

[1, 2, 3].sum() // 6
```
