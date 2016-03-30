/**
 @name partup.helpers.interpolateEmailMessage
 @memberof Partup.helpers
 */
Partup.helpers.interpolateEmailMessage = function(message, interpolations) {
    var m = message;

    mout.object.forOwn(interpolations, function(value, key) {
        var regex = new RegExp('\\[\\s*' + key + '\\s*\\]', 'i');
        m = m.replace(regex, value);
    });

    return m;
};
