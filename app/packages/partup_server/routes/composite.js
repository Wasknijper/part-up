Meteor.routeComposite = function(route, callback) {
    Router.route(route, {where: 'server', waitOn: function(){return Meteor.subscribe(route)}, fastRender: true}).get(function() {
        var request = this.request;
        var response = this.response;
        var params = this.params;

        var userId = request.user ? request.user._id : null;
        delete params.query.token;

        var composition = callback(request, _.extend({}, params));
        var result = compositionToResult(userId, composition.find.bind({userId: userId}), composition.children);

        // We are going to respond in JSON format
        response.setHeader('Content-Type', 'application/json');

        return response.end(JSON.stringify(result));
    });
};

var compositionToResult = function(userId, find, children) {
    var result = {};

    var cursor = find();
    if (! cursor) return;

    var documents = cursor.fetch();
    var collectionName = cursor._cursorDescription.collectionName;

    documents.forEach(function(document) {
        result[collectionName] = result[collectionName] || [];
        result[collectionName].push(document);

        if (children) {
            children.forEach(function(childComposition) {
                var r = compositionToResult(
                    userId,
                    childComposition.find.bind({userId: userId}, document),
                    childComposition.children
                );

                if (r) {
                    Object.keys(r).forEach(function(collectionName) {
                        result[collectionName] = result[collectionName] || [];

                        var documents = r[collectionName];

                        documents.forEach(function(document) {
                            result[collectionName].push(document);
                        });
                    });
                }
            });
        }
    });

    return result;
}
