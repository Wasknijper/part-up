var events = Npm.require('eventemitter2');

/**
 * The global event emitter instance.
 *
 * @type {EventEmitter2}
 * @namespace Event
 */
Event = new events.EventEmitter2({
    wildcard: true,
    delimiter: '.'
});
