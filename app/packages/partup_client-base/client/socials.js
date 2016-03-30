/**
 * Generate links to socials
 *
 * @class socials
 * @memberof Partup.client
 */
Partup.client.socials = {

    /**
     * Generate a link to share a URL on Facebook
     *
     * @memberof Partup.client.socials
     * @param {String} urlToShare URL to be shared
     */
    generateFacebookShareUrl: function(urlToShare) {
        var base = 'https://www.facebook.com/sharer/sharer.php';
        return base + '?s=100&p[url]=' + encodeURIComponent(urlToShare);

        //TODO: use new facebook api
        //var appId = Meteor.settings.public.facebookAppId;
        //var domain = Meteor.absoluteUrl();
        //return 'https://www.facebook.com/v2.0/dialog/share?app_id=' + appId + '&display=popup&href=' + urlToShare + '&redirect_uri=' + domain + '/close';
    },

    /**
     * Generate a link to share a URL on Twitter
     *
     * @memberof Partup.client.socials
     * @param {String} messageToShare Message to be shared
     * @param {String} urlToShare URL to be shared
     */
    generateTwitterShareUrl: function(messageToShare, urlToShare) {
        return 'http://twitter.com/intent/tweet?text=' + encodeURIComponent(messageToShare) + '&url=' + encodeURIComponent(urlToShare) + '&hashtags=partup&via=partupcom';
    },

    /**
     * Generate a link to share a URL on LinkedIn
     *
     * @memberof Partup.client.socials
     * @param {String} urlToShare URL to be shared
     */
    generateLinkedInShareUrl: function(urlToShare) {
        return 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(urlToShare);
    },

    /**
     * Generate a link to share a URL through mail
     *
     * @memberof Partup.client.socials
     * @param {String} subject The subject of the email
     * @param {String} body    The body of the email
     */
    generateMailShareUrl: function(subject, body) {
        return 'mailto:?body=' + encodeURIComponent(body) + '&subject=' + encodeURIComponent(subject);
    }

};

