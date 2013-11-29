~function (a) {
    a.sum = function (selector) {
        var source = this;
        var totalSum = 0;

        for (var i = 0; i < source.length; i++) {
            totalSum += selector(source[i]);
        }

        return totalSum;
    };

    a.select = function (selector) {
        var source = this;
        var array = [];

        for (var i = 0; i < source.length; i++) {
            array.push(selector(source[i]));
        }

        return array;
    };

    a.selectMany = function (selector) {
        var source = this;
        var array = [];

        for (var i = 0; i < source.length; i++) {
            var innerArray = selector(source[i]);
            if (innerArray.length) {
                for (var j = 0; j < innerArray.length; j++) {
                    array.push(innerArray[j]);
                }
            }
        }

        return array;
    };

    a.contains = function (item) {
        var source = this;

        for (var i = 0; i < source.length; i++) {
            if (source[i] === item) {
                return true;
            }
        }

        return false;
    };

    a.all = function (expression) {
        var source = this;
        var success = true;

        for (var i = 0; i < source.length; i++) {
            success = success && expression(source[i]);
        }

        return success;
    };

    a.any = function (expression) {
        if (expression === undefined) {
            return this.length > 0;
        }

        var source = this;

        for (var i = 0; i < source.length; i++) {
            if (expression(source[i])) {
                return true;
            }
        }

        return false;
    };

    a.where = function (expression) {
        var source = this;
        var array = [];

        for (var i = 0; i < source.length; i++) {
            if (expression(source[i])) {
                array.push(source[i]);
            }
        }

        return array;
    };

    a.first = function (expression) {
        if (expression == null) {
            return this.length > 0 ? this[0] : null;
        }

        var source = this,
            result = source.where(expression);

        return result.length > 0 ? result[0] : null;
    };

    a.last = function (expression) {
        if (expression == null) {
            return this.length > 0 ? this[this.length - 1] : null;
        }

        var source = this,
            result = source.where(expression);

        return result.length > 0 ? result[result.length - 1] : null;
    };

    a.distinct = function () {
        var source = this;
        var array = [];

        if (source.any() && source.all(function (i) { return i == null; })) {
            return [null];
        }

        for (var i = 0; i < source.length; i++) {
            var item = array.first(function (n) { return equalData(n, source[i]); });
            if (item === null) {
                array.push(source[i]);
            }
        }

        return array;
    };

    a.groupBy = function (selector) {
        var source = this;
        var array = [];

        for (var i = 0; i < source.length; i++) {
            var item = array.first(function (n) { return equalData(n.key, selector(source[i])); });
            if (item === null) {
                item = [];
                item.key = selector(source[i]);
                array.push(item);
            }

            item.push(source[i]);
        }

        return array;
    };

    a.indexOf = a.indexOf || function (elt /*, from*/) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);

        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }

        return -1;
    };

    a.getType = function (selector) {
        if (this.length == 0) return "undefined";

        for (var i = 0; i < this.length; i++) {
            var type = typeof selector(this[i]);
            if (type == "number") return "number";
            if (type == "string") return "string";
            if (type == "boolean") return "boolean";
            if (selector(this[i]) instanceof Date) return "Date";
        }

        return "undefined";
    };

    a.orderBy = function (selector) {
        if (this.length == 0) return [];

        var type = this.getType(selector);
        if (type == "number") {
            return this.sort(function (a, b) { return selector(a) - selector(b); });
        }
        else if (type == "string") {
            return this.sort(function (a, b) {
                var x = selector(a) || "",
                    y = selector(b) || "";

                return x < y ? -1 : (x > y ? 1 : 0);
            });
        }
        else if (type == "boolean") {
            return this.sort(function (a, b) { return selector(a) == selector(b) ? 1 : -1 });
        }
        else if (type == "Date") {
            return this.sort(function (a, b) { return (selector(a) || new Date(0)).getTime() - (selector(b) || new Date(0)).getTime(); });
        }
        else {
            return this;
        }
    };

    a.orderByDescending = function (selector) {
        if (this.length == 0) return [];

        var type = this.getType(selector);
        if (type == "number") {
            return this.sort(function (b, a) { return selector(a) - selector(b); });
        }
        else if (type == "string") {
            return this.sort(function (b, a) {
                var x = selector(a) || "",
                    y = selector(b) || "";

                return x < y ? -1 : (x > y ? 1 : 0);
            });
        }
        else if (type == "boolean") {
            return this.sort(function (b, a) { return selector(a) == selector(b) ? -1 : 1 });
        }
        else if (type == "Date") {
            return this.sort(function (b, a) { return (selector(a) || new Date(0)).getTime() - (selector(b) || new Date(0)).getTime(); });
        }
        else {
            return this;
        }
    };

    a.each = function (action) {
        var source = this;

        for (var i = 0; i < source.length; i++) {
            action.bind(source[i], i, source[i])();
        }

        return source;
    };

    function equalData(c, x) {
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
        if (typeof c === "number" || typeof c === "string") {
            return c === x;
        }

        // both undefined
        if (typeof c === "undefined") {
            return true;
        }

        // object properties compare
        for (var key in c) {
            if (c[key] !== x[key]) {
                return false;
            }
        }

        // all seems to be right
        return true;
    }
}(Array.prototype);
