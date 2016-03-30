// Disable all default response headers (we want to control them manually)
JsonRoutes.setResponseHeaders({});

// Enable caching for a couple of different endpoints
JsonRoutes.Middleware.use(function(request, response, next) {
    var urlRegexesToCache = [
        /\/networks\/[a-zA-Z0-9-]+$/, // /networks/lifely-open
        /\/networks\/featured\/[a-zA-Z]+$/, // /networks/featured/en
        /\/partups\/by_ids\/[a-zA-Z0-9,]+$/, // /partups/by_ids/vGaxNojSerdizDPjb
        /\/partups\/discover??((?!userId).)*$/, // /partups/discover?query (only if userId is not present)
        /\/partups\/discover\/count??((?!userId).)*$/, // /partups/discover/count?query (only if userId is not present)
        /\/partups\/home\/[a-zA-Z]+$/, // /partups/home/en
        /\/partups\/featured_one_random\/[a-zA-Z]+$/, // /partups/featured_one_random/en
        /\/users\/count$/, // /users/count
    ];

    var shouldCache = false;

    urlRegexesToCache.forEach(function(regex) {
        if (regex.test(request.url)) shouldCache = true;
    });

    response.setHeader('Cache-Control', shouldCache ? 'public, max-age=3600' : 'no-store, max-age=0');

    next();
});
