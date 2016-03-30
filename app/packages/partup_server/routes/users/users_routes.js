/*
 * Count route for /users
 */
Router.route('/users/count', {where: 'server'}).get(function() {
    var request = this.request;
    var response = this.response;

    // We are going to respond in JSON format
    response.setHeader('Content-Type', 'application/json');

    return response.end(JSON.stringify({error: false, count: Meteor.users.find().count()}));
});

/*
 * Count route for /users/:id/upperpartups
 */
Router.route('/users/:id/upperpartups/count', {where: 'server'}).get(function() {
    var request = this.request;
    var response = this.response;
    var params = this.params;

    // We are going to respond in JSON format
    response.setHeader('Content-Type', 'application/json');

    var parameters = {
        limit: request.query.limit,
        skip: request.query.skip,
        archived: request.query.archived || false
    };

    parameters.archived = (request.query.archived) ? JSON.parse(request.query.archived) : false;

    var userId = request.user ? request.user._id : null;

    var user = Meteor.users.findOne(params.id);
    if (!user) {
        response.statusCode = 404;
        return response.end(JSON.stringify({error: {reason: 'error-user-notfound'}}));
    }

    var partups = Partups.findUpperPartupsForUser(user, parameters, userId);

    return response.end(JSON.stringify({error: false, count: partups.count()}));
});

/*
 * Count route for /users/:id/supporterpartups
 */
Router.route('/users/:id/supporterpartups/count', {where: 'server'}).get(function() {
    var request = this.request;
    var response = this.response;
    var params = this.params;

    // We are going to respond in JSON format
    response.setHeader('Content-Type', 'application/json');

    var parameters = {
        limit: request.query.limit,
        skip: request.query.skip,
        archived: request.query.archived || false
    };

    parameters.archived = (request.query.archived) ? JSON.parse(request.query.archived) : false;

    var userId = request.user ? request.user._id : null;

    var user = Meteor.users.findOne(params.id);
    if (!user) {
        response.statusCode = 404;
        return response.end(JSON.stringify({error: {reason: 'error-user-notfound'}}));
    }

    var partups = Partups.findSupporterPartupsForUser(user, parameters, userId);

    return response.end(JSON.stringify({error: false, count: partups.count()}));
});
