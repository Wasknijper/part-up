/**
 @namespace Partup helper service
 @name Partup.services.website
 @memberof Partup.services
 */
Partup.services.website = {
    /**
     * Transform a clean url to a full url
     *
     * @memberof services.website
     * @param {String} cleanUrl
     */
    cleanUrlToFullUrl: function(cleanUrl) {
        if (!cleanUrl) return '';

        var fullUrl = cleanUrl;
        if (cleanUrl.indexOf('http://') !== 0 && cleanUrl.indexOf('https://') !== 0) {
            fullUrl = 'http://' + cleanUrl;
        }
        return fullUrl;
    },

    /**
     * Transform a full url to a clean url
     *
     * @memberof services.website
     * @param {String} fullUrl
     */
    fullUrlToCleanUrl: function(fullUrl) {
        if (!fullUrl) return '';

        return fullUrl.replace(/^(http:\/\/|https:\/\/)/i, '');
    }
};
