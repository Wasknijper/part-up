/**
 * All language related functionality
 *
 * @class language
 * @memberof Partup.client
 */

Partup.client.language = {
    current: new ReactiveVar(),
    /**
     * Set the language of partup
     *
     * @memberof Partup.client.language
     * @param {String} language
     */
    change: function(language) {
        var self = this;

        // prevent unnessesary language changes
        var currentLanguage = Partup.client.language.current.get();
        if (language === currentLanguage) return;

        TAPi18n.setLanguage(language).done(function() {
            // Change MomentJS language
            moment.locale(language);
            Partup.client.language.current.set(language);
            // Change datepicker language
            $.fn.datepicker.dates[language] = {
                days: moment.weekdays(),
                daysShort: moment.weekdaysShort(),
                daysMin: moment.weekdaysMin(),
                months: moment.months(),
                monthsShort: moment.monthsShort(),
                today: 'Today',
                clear: 'Clear'
            };

            // Change datepicker options
            Partup.client.datepicker.options.format = moment.localeData().longDateFormat('L').toLowerCase();
            Partup.client.datepicker.options.language = language;

            // Change SimpleSchema error messages language
            SimpleSchema.messages({
                required:            TAPi18n.__('base-client-language-ss-required'),
                minString:           TAPi18n.__('base-client-language-ss-minString'),
                maxString:           TAPi18n.__('base-client-language-ss-maxString'),
                individualMaxString: TAPi18n.__('base-client-language-ss-individualMaxString'),
                minNumber:           TAPi18n.__('base-client-language-ss-minNumber'),
                maxNumber:           TAPi18n.__('base-client-language-ss-maxNumber'),
                minDate:             TAPi18n.__('base-client-language-ss-minDate'),
                maxDate:             TAPi18n.__('base-client-language-ss-maxDate'),
                badDate:             TAPi18n.__('base-client-language-ss-badDate'),
                minCount:            TAPi18n.__('base-client-language-ss-minCount'),
                maxCount:            TAPi18n.__('base-client-language-ss-maxCount'),
                noDecimal:           TAPi18n.__('base-client-language-ss-noDecimal'),
                notAllowed:          TAPi18n.__('base-client-language-ss-notAllowed'),
                expectedString:      TAPi18n.__('base-client-language-ss-expectedString'),
                expectedNumber:      TAPi18n.__('base-client-language-ss-expectedNumber'),
                expectedBoolean:     TAPi18n.__('base-client-language-ss-expectedBoolean'),
                expectedArray:       TAPi18n.__('base-client-language-ss-expectedArray'),
                expectedObject:      TAPi18n.__('base-client-language-ss-expectedObject'),
                expectedConstructor: TAPi18n.__('base-client-language-ss-expectedConstructor'),
                keyNotInSchema:      TAPi18n.__('base-client-language-ss-keyNotInSchema'),
                regEx: [
                                                            {msg: TAPi18n.__('base-client-language-ss-regex-default')},
                    {exp: Partup.services.validators.email,  msg: TAPi18n.__('base-client-language-ss-regex-Email')},
                    {exp: SimpleSchema.RegEx.Domain,         msg: TAPi18n.__('base-client-language-ss-regex-Domain')},
                    {exp: SimpleSchema.RegEx.WeakDomain,     msg: TAPi18n.__('base-client-language-ss-regex-WeakDomain')},
                    {exp: SimpleSchema.RegEx.IP,             msg: TAPi18n.__('base-client-language-ss-regex-IP')},
                    {exp: SimpleSchema.RegEx.IPv4,           msg: TAPi18n.__('base-client-language-ss-regex-IPv4')},
                    {exp: SimpleSchema.RegEx.IPv6,           msg: TAPi18n.__('base-client-language-ss-regex-IPv6')},
                    {exp: SimpleSchema.RegEx.Url,            msg: TAPi18n.__('base-client-language-ss-regex-Url')},
                    {exp: SimpleSchema.RegEx.Id,             msg: TAPi18n.__('base-client-language-ss-regex-Id')},
                ],
                passwordMismatch:       TAPi18n.__('base-client-language-ss-passwordMismatch'),
                emailExists:            TAPi18n.__('base-client-language-ss-emailExists'),
                emailNotFound:          TAPi18n.__('base-client-language-ss-emailNotFound'),
                passwordIncorrect:      TAPi18n.__('base-client-language-ss-passwordIncorrect'),
                shouldNotContainHtml:   TAPi18n.__('base-client-language-ss-shouldNotContainHtml'),
                missingRequiredTags:    TAPi18n.__('base-client-language-ss-missingRequiredTags'),
                shouldNotContainUrls:   TAPi18n.__('base-client-language-ss-shouldNotContainUrls')
            });
            var user = Meteor.user();
            if (!user) return;
            // update the user stored language setting for future logins
            Meteor.call('settings.update', {locale: language}, function(err) {
                if (err) {
                    Partup.client.notify.error('Could not set the correct language');
                    return;
                }
            });

        }).fail(function(error_message) {
            Partup.client.notify.error('Could not load the language "' + language + '"');
        });
    },
    /**
     * Checks for the browser language settings and returns the locale
     * Only to be used if everything else fails.
     *
     * @memberof Partup.client.language
     */
    getBrowserDefaultLocale: function() {
        var language = 'en';
        if (TAPi18n && Partup) {
            var detectedLocale = navigator.language || navigator.userLanguage;    // value is like: en-US
            if (detectedLocale && detectedLocale.match(/^[a-z]{2}-[a-z]{2}$/i)) {  // if the value matches 'xx-xx'
                detectedLocale = detectedLocale.split('-')[0];                    // value is like: en
            }
            language = detectedLocale || 'en';
        }
        return language;
    },
    /**
     * Sets the language of partup to the default settings (browser settings)
     *
     * @memberof Partup.client.language
     */
    setDefault: function(user) {
        var self = this;
        if (user) {
            var userLocale = mout.object.get(user, 'profile.settings.locale');
            // if the user has a locale setting
            if (userLocale) {
                self.change(userLocale);
                return;
            }
        }
        // fallback to ip based locale
        Meteor.call('users.get_locale', function(error, locale) {
            if (error) {
                // when some kind of error occurs, fallback to browser settings
                var browserLocale = self.getBrowserDefaultLocale();
                self.change(browserLocale);
                return;
            }
            // set locale to ip based locale
            self.change(locale);
        });
    }

};
