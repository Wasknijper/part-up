var CountryLanguage = Npm.require('country-language');
var d = Debug('services:language');

/**
 @namespace Partup server language service
 @name Partup.server.services.language
 @memberof Partup.server.services
 */
Partup.server.services.language = {
    /**
     * Get native language name from a country code
     *
     * @param {String} languageCode
     *
     * @return {String}
     */
    nativeLanguageName: function(languageCode) {
        return CountryLanguage.getLanguage(languageCode, function(error, languages) {
            if (error) {
                Log.error('Error while trying to get native language name from languageCode [' + languageCode + ']: ' + error);
            } else {
                var nativeName = languages.nativeName[0].toLocaleLowerCase();

                d('Got language name [' + nativeName + '] from country code [' + languageCode + ']');

                return nativeName;
            }
        });
    },

    addNewLanguage: function(languageCode) {
        if (!Languages.findOne({_id: languageCode})) {
            var nativeLanguageName = this.nativeLanguageName(languageCode);
            Languages.insert({_id: languageCode, native_name: nativeLanguageName});
        }
    }
};
