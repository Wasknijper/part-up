var d = Debug('event_handlers');

/**
 * Log every event fired by the application including it's arguments
 */
Event.onAny(function() {
    d('Event fired', this.event);

    if (process.env.LOG_EVENTS) {
        Log.debug('Event fired: '.white + this.event.magenta, arguments);
    }

    if (process.env.EVENT_ENDPOINT_URL && process.env.EVENT_ENDPOINT_AUTHORIZATION) {
        var data = {
            'timestamp': new Date().toISOString(),
            'eventname': this.event,
            'payload': arguments
        };
        HTTP.call('POST', process.env.EVENT_ENDPOINT_URL, {
            data: data,
            headers: {
                'Authorization': 'Bearer ' + process.env.EVENT_ENDPOINT_AUTHORIZATION
            },
            npmRequestOptions: {
                rejectUnauthorized: false
            }
        }, function(err, result) {
            if (err && process.env.LOG_EVENTS) {
                Log.error('Could not push event to store.');
                Log.error(err);
                Log.error(result);
            } else {
                //silently ignore success of posting to eventstore
            }
        });
    } else {
        Log.debug('Event store endpoint is not configured.');
    }
});

