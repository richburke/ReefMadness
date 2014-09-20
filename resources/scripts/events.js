/**
 * @todo
 * Convert to module.
 */

var E_ = (function() {

  var eventuality = function(that) {
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

  /*
   For each topic there might be a list of receivers or message queues
   The message is sent to those items.
   A message queue is essentially a listener and a broadcaster.
   */
  var broadcaster = function(that) {
    var _topics_listeners = {};

    /*
     Receives a listener object.  Pass it an event type and an event
     */
    var _fncBroadcast = function(listener) {
      if (listener.hasOwnProperty('handle')) {
        listener.on(event.type, event);
      }
      var fnc = handler.method;
      if (typeof fnc === 'string') {
        fnc = this[fnc];
      }

      fnc.apply(this, handler.parameters || [event]);
    };

    that.broadcast = function(topic, message) {
      var type = typeof event === 'string' ? event : event.type;

      if (_channels.hasOwnProperty(channel)) {
        _channels[channel].map(_fncBroadcast, this);
      }

      return this;
    };
    that.addListener = function(topic, listener) {

    };
    that.clearListeners = function(topic) {
      if (_channels.hasOwnProperty(type)) {
        _channels[type] = [];
      }

      return this;
    };

    return that;
  };

  /**
   *
   * Broadcaster...
   * fnc.apply(<listener>, handler.parameters || [topic]);
   *
   * <topic>, <listener>, <handler>, <parameters>
   *
   *   @todo
   *   remove channels, just use topics
   */

  var listener = function(that) {
    var _topic_handlers = {};

    that.handleBroadcast = function(topic, message) {
      return this;
    };
    that.onBroadcastReceived = function(topic, handler, parameters) {
      // create topic on channel if it doesn't exist
      return this;
    };

    return that;
  };

  var mq = function(that) {
    return broadcaster(listener(that));
  };

  var factory = function() {
    var that = {};
    that.eventuality = function(p) {
      return eventuality(p);
    };
    that.mq = function(p) {
      return mq(p);
    };
    that.listener = function(p) {
      return listener(p);
    };
    that.broadcaster = function(p) {
      return broadcaster(p);
    };

    return that;
  };

  return factory();
}());
