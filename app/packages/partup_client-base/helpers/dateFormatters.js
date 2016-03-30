/*************************************************************/
/* Global date formatter helpers */
/*************************************************************/
Template.registerHelper('partupDateNormal', function(date) {
    return moment(date).format('LL');
});

Template.registerHelper('partupDateFull', function(date) {
    return moment(date).format('LLL');
});

Template.registerHelper('partupDateOnly', function(date) {
    return moment(date).format('LL');
});

Template.registerHelper('partupDateTime', function(date) {
    return moment(date).format('LT');
});

Template.registerHelper('partupDateCustom', function(date, format) {
    return moment(date).format(format);
});

Template.registerHelper('partupDatePartupActivity', function(date) {
    var RELATIVE_TIME_THRESHOLD = 12 * 60 * 60 * 1000; // 12 hours

    // Moment dates
    var mDate = moment(date);
    var mNow = moment(Partup.client.reactiveDate());

    // If the time is under the Relative Time Threshold...
    if (mNow.diff(mDate) < RELATIVE_TIME_THRESHOLD) {
        return Partup.client.moment.localConfig({
            relativeTime: {
                s:  TAPi18n.__('base-helpers-dateFormatters-difference-time-s'),
                m:  TAPi18n.__('base-helpers-dateFormatters-difference-time-m'),
                mm:  TAPi18n.__('base-helpers-dateFormatters-difference-time-mm'),
                h:  TAPi18n.__('base-helpers-dateFormatters-difference-time-h'),
                hh:  TAPi18n.__('base-helpers-dateFormatters-difference-time-hh'),
            }
        }, {}, function() {
            return mDate.fromNow(true);
        });
    }

    // Default
    return mDate.format('LT');
});

Template.registerHelper('partupDateComment', function(date) {
    var RELATIVE_TIME_THRESHOLD = 21 * 60 * 60 * 1000; // 21 hours
    // ^^ Be sure this treshold is under 22 hours,
    //    because the default Moment treshold for showing
    //    either "22 hours ago" or "Yesterday" is 22 hours.

    // Moment dates
    var mDate = moment(date);
    var mNow = moment(Partup.client.reactiveDate());

    // If the time is under the Relative Time Threshold...
    if (mNow.diff(mDate) < RELATIVE_TIME_THRESHOLD) {
        return Partup.client.moment.localConfig({
            relativeTime: {
                s:  TAPi18n.__('base-helpers-dateFormatters-difference-time-s'),
                m:  TAPi18n.__('base-helpers-dateFormatters-difference-time-m'),
                mm:  TAPi18n.__('base-helpers-dateFormatters-difference-time-mm'),
                h:  TAPi18n.__('base-helpers-dateFormatters-difference-time-h'),
                hh:  TAPi18n.__('base-helpers-dateFormatters-difference-time-hh'),
            }
        }, {}, function() {
            return mDate.fromNow(true);
        });
    }

    // If the time is in the same year
    if (mDate.year() === mNow.year()) {
        return mDate.format(TAPi18n.__('base-helpers-dateFormatters-format-sameyear'));
    }

    // Default
    return mDate.format(TAPi18n.__('base-helpers-dateFormatters-format-anotheryear'));
});

Template.registerHelper('partupDatePartupTimeline', function(date) {
    var RELATIVE_TIME_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 1 week

    // Moment dates
    var mDate = moment(date);
    var mNow = moment();

    // If the time is under the Relative Time Threshold...
    if (mNow.diff(mDate) < RELATIVE_TIME_THRESHOLD) {
        return Partup.client.moment.localConfig({
            relativeTime: {
                d:  TAPi18n.__('base-helpers-dateFormatters-difference-days-d'),
                dd:  TAPi18n.__('base-helpers-dateFormatters-difference-days-dd'),
            },
        }, {
            remember: function() {
                return {
                    rtt_s: moment.relativeTimeThreshold('s'),
                    rtt_m: moment.relativeTimeThreshold('m'),
                    rtt_h: moment.relativeTimeThreshold('h'),
                };
            },
            change: function(memory) {
                moment.relativeTimeThreshold('s', 0);
                moment.relativeTimeThreshold('m', 0);
                moment.relativeTimeThreshold('h', 0);
            },
            revert: function(memory) {
                moment.relativeTimeThreshold('s', memory.rtt_s);
                moment.relativeTimeThreshold('m', memory.rtt_m);
                moment.relativeTimeThreshold('h', memory.rtt_h);
            }
        }, function() {
            return mDate.fromNow(true);
        });
    }

    return mDate.format('LL');
});

Template.registerHelper('partupDateNotification', function(date) {
    var RELATIVE_TIME_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 1 week

    // Moment dates
    var mDate = moment(date);
    var mNow = moment(Partup.client.reactiveDate());

    // If the time is under the Relative Time Threshold...
    if (mNow.diff(mDate) < RELATIVE_TIME_THRESHOLD) {
        return Partup.client.moment.localConfig({
            relativeTime: {
                s:  TAPi18n.__('base-helpers-dateFormatters-notification-difference-time-s'),
                m:  TAPi18n.__('base-helpers-dateFormatters-notification-difference-time-m'),
                mm:  TAPi18n.__('base-helpers-dateFormatters-notification-difference-time-mm'),
                h:  TAPi18n.__('base-helpers-dateFormatters-notification-difference-time-h'),
                hh:  TAPi18n.__('base-helpers-dateFormatters-notification-difference-time-hh'),
                d:  TAPi18n.__('base-helpers-dateFormatters-difference-days-d'),
                dd:  TAPi18n.__('base-helpers-dateFormatters-difference-days-dd'),
            }
        }, {}, function() {
            return mDate.fromNow(true);
        });
    }

    // If the time is in the same year
    if (mDate.year() === mNow.year()) {
        return mDate.format(TAPi18n.__('base-helpers-dateFormatters-format-sameyear'));
    }

    // Default
    return mDate.format(TAPi18n.__('base-helpers-dateFormatters-format-anotheryear'));
});
