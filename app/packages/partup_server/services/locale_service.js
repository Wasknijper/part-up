/**
 @namespace Partup server locale service
 @name Partup.server.services.locale
 @memberof Partup.server.services
 */
Partup.server.services.locale = {
    /**
     * Return a user's locale
     *
     * @param  {string} ipAddress
     * @return {String}
     */
    get_locale: function(ipAddress) {
        var DEFAULT_LOCALE = 'en';

        try {
            var response = HTTP.get('http://ip-api.com/json/' + ipAddress);

            if (response.statusCode !== 200) {
                Log.error('IP API resulted in an error [' + response.statusCode + ']', response);
                return DEFAULT_LOCALE;
            }

            var data = get(response, 'data');

            if (data.status !== 'success') {
                Log.error('IP API had unsuccessful results, returning default locale');
                return DEFAULT_LOCALE;
            }

            var countryCode = data.countryCode.toLocaleLowerCase();
            var locale = countryCode === 'nl' ? 'nl' : DEFAULT_LOCALE; // Must be either Dutch or English
            Log.debug('Got country code [' + countryCode + ']. Returning [' + locale + ']');

            return locale;
        } catch (error) {
            Log.error('Error while retrieving country data from IP: ' + error);
            return DEFAULT_LOCALE;
        }
    }
};
