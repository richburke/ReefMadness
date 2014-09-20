/**
 * @todo
 * Convert to module.
 */

var S_ = (function() {

  var _eventuality = function(that) {
    var _registry = {};

    var _fncFire = function(handler) {
      var fnc = handler.method;
      if (typeof fnc === 'string') {
        fnc = this[fnc];
      }

      fnc.apply(this, handler.parameters || [event]);
    };

    that.fire = function(event) {
      var type = typeof event === 'string' ? event : event.type;

      if (_registry.hasOwnProperty(type)) {
        _registry[type].map(_fncFire, this);
      }

      return this;
    };
    that.on = function(type, method, parameters) {
      var handler = {
        method: method,
        parameters: parameters
      };

      if (_registry.hasOwnProperty(type)) {
        _registry[type].push(handler);
      }
      else {
        _registry[type] = [handler];
      }

      return this;
    };
    that.clear = function(type) {
      if (_registry.hasOwnProperty(type)) {
        _registry[type] = [];
      }

      return this;
    };

    return that;
  };

  var sprite = function(p) {
    var type = p.type || '';
    var actor = p.actor || null;

    var that = {};
    that.onEnterCell = function() {

    };
    that.onExitCell = function() {

    };
    that.set = function(k, v) {
      switch (k) {
        case 'type': type = v;
          return this;
        case 'actor': actor = v;
          return this;
      }
      return null;
    };
    that.get = function(k) {
      switch (k) {
        case 'type': return type;
        case 'actor': return actor;
      }
      return null;
    };
    that.render = p.render;

    return that;
  };

  var actor = function(p, d, my) {
    var name = p.name || '';
    var sprite = p.sprite || null;
    var behavior = p.behavior || null;
    var location = p.location || null;

    var that = {};
    that.onEnterCell = function() {

    };
    that.onExitCell = function() {

    };
    that.set = function(k, v) {
      switch (k) {
        case 'name': name = v;
          return this;
        case 'sprite': sprite = v;
          return this;
        case 'behavior': behavior = v;
          return this;
        case 'location': location = v;
          return this;
      }
      return this;
    };
    that.get = function(k) {
      switch (k) {
        case 'name': return name;
        case 'sprite': return sprite;
        case 'behavior': return behavior;
        case 'location': return location;
      }
      return null;
    };
    that.render = function(state) {
      return sprite.render(state);
    };

    return that;
  };

  var behavior = function() {
    var that = {};
    return that;
  };

  var factory = function() {
    var that = {};
    that.actor = function(p) {
      return actor(p);
    };
    that.sprite = function(p) {
      return sprite(p);
    };
    that.behavior = function(p) {
      return behavior(p);
    };

    return that;
  };

  return factory();
}());
