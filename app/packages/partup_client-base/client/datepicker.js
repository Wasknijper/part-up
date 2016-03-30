/**
 * Bootstrap datepicker options
 *
 * @class datepicker
 * @memberof Partup.client
 */
Partup.client.datepicker = {

    /**
     *
     * @memberof datepicker
     */
    options: {
        language: moment.locale(),
        format: moment.localeData().longDateFormat('L').toLowerCase(),
        autoclose: true,
        todayHighlight: true
    }

};
