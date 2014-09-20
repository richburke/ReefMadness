/**
 * Convert matrix to be an array of arrays.
 *
 * Remove width,height, depth from point & matrix values.  Make it an dimension
 * object of d1, d2, d3, etc., with dimension count property.
 *
 * Create vectors
 */

var M = (function() {

  'use strict';

  var dictionary = function(t) {
    var terms = t || {};

    var that = {};
    that.add = function(key, val) {
      terms[key] = val;
    };
    that.get = function(k) {
      switch (k) {
        case 'terms': return terms;
      }

      if (terms.hasOwnProperty(k)) {
        return terms[k];
      }

      return null;
    };
    that.getTerms = function() { return this.get('terms'); };

    return that;
  };

  /*
   numbers.map(function(number) { return letters.map(function(letter) { return number + letter;}) });
   */

  var set = function(v) {
    var _values = v.reduce(function(prev, curr) {
      return (_isUnique(prev, curr)) ? prev.concat(curr) : prev;
    }, []);

    function _isUnique(a, item) {
      return a.indexOf(item) == -1;
    }

    var that = {};
    that.add = function(val) {
      if (_isUnique(_values, val)) {
        _values = _values.concat(val);
      }
      return this;
    };
    that.get = function(k) {
      return _values;
    };

    return that;
  };

  /**
   * Rename to DimensionalPoint
   */
  var point = function(p) {
    var x = p.x || 0;
    var y = p.y || 0;
    var z = p.z || 0;

    var that = {};
    that.add = function(pt) {
      return point({x:x + pt.x(), y:y + pt.y(), z:z + pt.z()});
    };
    that.x = function() {
      return x;
    };
    that.y = function() {
      return y;
    };
    that.z = function() {
      return z;
    };
    that.toString = function() {
      return '(' + x + ', ' + y + ', ' + z + ')';
    };

    return that;
  };

  var point2d = function(p) {
    var x = p.x || 0;
    var y = p.y || 0;

    var that = {};
    that.add = function(pt) {
      return point({x:x + pt.x(), y:y + pt.y()});
    };
    that.x = function() {
      return x;
    };
    that.y = function() {
      return y;
    };
    that.toString = function() {
      return '(' + x + ', ' + y + ')';
    };

    return that;
  };

  /**
   * @todo
   * Change point to location.
   */
  var element = function(p) {
    var point = p.point;
    var contents = p.contents || null;

    var that = {};
    that.set = function(k, v) {
      switch (k) {
        /**
         * remove setting point.  that can only be done on initialization.
         */
        case 'point': point = v;
          return this;
        case 'contents': contents = v;
          return this;
      }
      return this;
    };
    that.get = function(k) {
      switch (k) {
        case 'point': return point;
        case 'contents': return contents;
      }
      return null;
    };
    that.isEmpty = function() {
      return contents === null;
    };
    that.exec = function(fnc) {
      if (contents !== null && typeof contents === 'object') {
        fnc.call(contents, contents, point);
      }
      else {
        fnc(contents, point);
      }
      return this;
    };

    return that;
  };

  var matrix = function(p) {
    var _dimensions = [];
    var _positions = [];
    var _elements = {};

    var _fncCreateIdFromPosition = function(a) {
      return '(' + a.join(',') + ')';
    };
    var _fncNormalizeId = function(pos) {
      if (typeof pos === 'string') {
        return pos;
      }
      return _fncCreateIdFromPosition(pos);
    };
    var fncTraverse = function(fnc) {

    };


    // for each dimension,

    // traverse()? . filter() . reduce()

    var that = {};
    that.generate = function(dimensions, def) {
      var id, position, element, value;

      _dimensions = dimensions;

      /**
       * @todo
       * make it flexible by dimensions
       * functionalize
       * make a range method for array
       */
      for (var k = 1; k <= dimensions[2]; k++) {
        for (var j = 1; j <= dimensions[1]; j++) {
          for (var i = 1; i <= dimensions[0]; i++) {
            position = [i, j, k];
            id = _fncCreateIdFromPosition(position);

            if (typeof def === 'function') {
              value = def(position);
            }
            else {
              value = def;
            }

            _elements[id] = {id:id, position:position, value:value};
          }
        }
      }

      return this;
    };


//    that.traverse = p.traverse || fncTraverse;
    that.numberOfDimensions = _dimensions.length;
    that.set = function(k, v, strict) {
      strict = strict || false;

      switch (k) {
        case 'cells':
        case 'elements': elements = v;
          return this;
      }

      if (strict) {
        throw new Error('unknown property');
      }

      this[k] = v;
      return this;
    };
    that.get = function(k) {
      switch (k) {
        case 'cells':
        case 'elements': return _elements;
      }
      return null;
    };
    that.getIds = function() {

    };
    that.getValues = function() {

    };
    that.put = function(pos, val) {
      var id = _fncNormalizeId(pos);

      if (_elements.hasOwnProperty(id)) {
        _elements[id].value = val;
      }

      return this;
    };
    that.pull = function(pos) {
      var id = _fncNormalizeId(pos);

      if (_elements.hasOwnProperty(id)) {
        return _elements[id].value;
      }
      return null;
    };
    that.each = function(fnc) {
      _elements.forEach(function(item, i) {
        if (item !== null && typeof item === 'object') {
          fnc.call(item, item, i);
        }
      });
    };

    return that;
  };

  var matrix2d = function(p) {
    var width = p.width || null;
    var height = p.height || null;
    var elements = p.elements || [];

    var calculateIndex = function(x, y) {
      return y * width + x;
    };

    var that = {};
    that.init = function(default_contents) {
      var default_contents = default_contents || null;
      /**
       * @todo
       * functionalize
       */

      for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
          elements.push(element({point:point2d({x:i, y:j}), contents:default_contents}));
        }
      }

      return this;
    };
    that.set = function(k, v, strict) {
      strict = strict || false;

      switch (k) {
        case 'cells':
        case 'elements': elements = v;
          return this;
      }

      if (strict) {
        throw new Error('unknown property');
      }

      this[k] = v;
      return this;
    };
    that.get = function(k) {
      switch (k) {
        case 'cells':
        case 'elements':
          return elements;
      }
      return null;
    };
    that.put = function(pt, contents) {
      var index = calculateIndex(pt.x(), pt.y());
      console.log('index is ' + index);
      elements[index].set('contents', contents);
      return this;
    };
    that.pluck = function(x, y) {
      var index = calculateIndex(x, y);
      return elements[index];
    };
    that.pull = function(x, y) {
      var element = this.pluck(x, y);
      this.put(x, y, null);
      return element;
    };
    that.isEmpty = function(x, y) {
      var element = this.pluck(x, y);
      return element.get('contents') === null;
    };
    that.each = function(fnc) {
      elements.forEach(function(item, i) {
        if (item !== null && typeof item === 'object') {
          fnc.call(item, item, i);
        }
      });
    };

    return that;
  };

  var factory = function() {
    var that = {};
    that.dictionary = function(p) {
      return dictionary(p);
    };
    that.set = function(p) {
      return set(p);
    };
    that.point = function(p) {
      var dim = 0;
      var prop;
      for (prop in p) {
        if (p.hasOwnProperty(prop)) {
          dim++;
        }
      }

      return dim === 3 ? point(p): point2d(p);
    };
    that.element = function(p) {
      return element(p);
    };
    that.matrix = function(dim, p) {
//      return dim === 3 ? matrix(p): matrix2d(p);
      return matrix(p);
    };

    return that;
  };

  return factory();
}());
