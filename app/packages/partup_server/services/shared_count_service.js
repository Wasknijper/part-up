var d = Debug('services:shared_count');

/**
 @namespace Partup server shared count service
 @name Partup.server.services.shared_count
 @memberof Partup.server.services
 */
Partup.server.services.shared_count = {
    facebook: function(url) {
        var response = HTTP.get('http://graph.facebook.com/?id=' + url);

        if (response.statusCode !== 200) {
            Log.error('Facebook Graph API resulted in status code [' + response.statusCode + ']', response);
            return false;
        }

        var data = mout.object.get(response, 'data');
        if (!data) return false;

        return data.shares ? data.shares : 0;
    },

    twitter: function(url) {
        var response = HTTP.get('https://cdn.api.twitter.com/1/urls/count.json?url=' + url);

        if (response.statusCode !== 200) {
            Log.error('Twitter shared count API resulted in status code [' + response.statusCode + ']', response);
            return false;
        }

        var data = mout.object.get(response, 'data');
        if (!data) return false;

        return data.count;
    },

    linkedin: function(url) {
        var response = HTTP.get('https://www.linkedin.com/countserv/count/share?format=json&url=' + url);

        if (response.statusCode !== 200) {
            Log.error('LinkedIn shared count API resulted in status code [' + response.statusCode + ']', response);
            return false;
        }

        var data = mout.object.get(response, 'data');
        if (!data) return false;

        return data.count;
    }
};
