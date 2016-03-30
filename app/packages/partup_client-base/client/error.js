/**
 * Error function for global use
 *
 * @class error
 * @memberof Partup.client
 */
Partup.client.error = function(context, msg) {
    var full_msg = context + ': ' + msg;
    var err = new Error(full_msg);
    console.error(err);
    return;
};
