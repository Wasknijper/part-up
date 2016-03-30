/*
 * Count route for /networks/:0/partups
 */
Router.route('/networks/:slug/partups/count', {where: 'server'}).get(function() {
    var request = this.request;
    var response = this.response;
    var params = this.params;

    // We are going to respond in JSON format
    response.setHeader('Content-Type', 'application/json');

    var options = {
        limit: request.query.limit || 0,
        skip: request.query.skip
    };

    var userId = request.user ? request.user._id : null;

    var parameters = {
        archived: (request.query.archived) ? JSON.parse(request.query.archived) : false
    };

    var network = Networks.guardedFind(userId, {slug: params.slug}).fetch().pop();
    if (!network) {
        response.statusCode = 404;
        return response.end(JSON.stringify({error: {reason: 'error-network-notfound'}}));
    }

    var partups = Partups.findForNetwork(network, parameters, options, userId);

    return response.end(JSON.stringify({error: false, count: partups.count()}));
});

/*
 * Count route for /networks/:0/uppers
 */
Router.route('/networks/:slug/uppers/count', {where: 'server'}).get(function() {
    var request = this.request;
    var response = this.response;
    var params = this.params;

    // We are going to respond in JSON format
    response.setHeader('Content-Type', 'application/json');

    var userId = request.user ? request.user._id : null;

    var network = Networks.guardedFind(userId, {slug: params.slug}, {}).fetch().pop();
    if (!network) {
        response.statusCode = 404;
        response.end(JSON.stringify({error: {reason: 'error-network-notfound'}}));
    }

    var uppers = Meteor.users.findMultiplePublicProfiles(network.uppers, {}, {
        count: true
    });

    return response.end(JSON.stringify({error: false, count: uppers.count()}));
});
