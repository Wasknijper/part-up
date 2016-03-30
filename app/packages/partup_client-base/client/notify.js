/**
 * Create notifications in the ui
 *
 * @class notify
 * @memberof Partup.client
 */
if (toastr && jQuery) {
    Partup.client.notify = {};

    /**
     * create info message
     *
     * @memberof Partup.client.notify
     * @param {String} msg message to display in notification
     */
    Partup.client.notify.info = function notifyInfo(msg) {
        toastr.info(msg);
    };

    /**
     * create warning message
     *
     * @memberof Partup.client.notify
     * @param {String} msg message to display in notification
     */
    Partup.client.notify.warning = function notifyWarning(msg) {
        toastr.warning(msg);
    };

    /**
     * create warning success
     *
     * @memberof Partup.client.notify
     * @param {String} msg message to display in notification
     */
    Partup.client.notify.success = function notifySuccess(msg) {
        toastr.success(msg);
    };

    /**
     * create warning error
     *
     * @memberof Partup.client.notify
     * @param {String} msg message to display in notification
     */
    Partup.client.notify.error = function notifyError(msg) {
        toastr.error(msg);
    };

    /**
     * clear all notifications
     *
     * @memberof Partup.client.notify
     */
    Partup.client.notify.clear = function notifyClear() {
        toastr.clear();
    };

    // Toastr configuration
    toastr.options.tapToDismiss = false;
    toastr.options.timeOut = 3500;
    toastr.options.containerId = 'pu-notifycontainer';
    toastr.options.toastClass = 'pu-toast';
    toastr.options.iconClasses = {
        error: 'pu-toast-error',
        info: 'pu-toast-info',
        success: 'pu-toast-success',
        warning: 'pu-toast-warning'
    };
    toastr.options.iconClass = 'pu-sub-icon';
    toastr.options.positionClass = '';
    toastr.options.titleClass = 'pu-sub-title';
    toastr.options.messageClass = 'pu-sub-message';
    toastr.options.target = 'body';
    toastr.options.newestOnTop = true;
    toastr.options.preventDuplicates = false;
    toastr.options.progressBar = false;
    toastr.options.closeHtml = '';
    toastr.options.showMethod = 'puNotifyIn';
    toastr.options.hideMethod = 'puNotifyOut';
    toastr.options.showDuration = 600;
    toastr.options.hideDuration = 600;

    // Extend jQuery with out notification animation
    jQuery.fn.extend({
        puNotifyIn: function() {
            return this.each(function() {
                var $elm = jQuery(this);
                $elm.show(0);
                $elm.addClass('pu-state-show');
                setTimeout(function puNotifyInCompleted () {
                    $elm.addClass('pu-state-shown');
                }, toastr.options.showDuration);
            });
        },
        puNotifyOut: function(options) {
            return this.each(function() {
                var $elm = jQuery(this);
                $elm.removeClass('pu-state-show');
                setTimeout(function puNotifyOutCompleted () {
                    $elm.hide(0);
                    options.complete();
                }, toastr.options.hideDuration);
            });
        }
    });

}
