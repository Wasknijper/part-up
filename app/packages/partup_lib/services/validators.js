/**
 @namespace Validators helper service
 @name partup.services.validators
 @memberof Partup.services
 */
Partup.services.validators = {
    tagsSeparatedByComma: /^\s*(\w|-|&|\.)*(\s*,?\s*(\w|-|&|\.)*)*\s*$/,

    // minimum 8 characters, at least 1 number, at least 1 capital letter
    password: /(?=^.{8,}$)(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,

    // according to RFC 5322 official standard
    email: /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,

    // Facebook usernames can only contain a-z A-Z 0-9 and .
    // minimum is 5 and max is infinity (not validated)
    facebookUsername: /^[a-zA-Z0-9.]{5,}$/,

    // Instagram usernames can only contain a-z A-Z . and _
    // max length is 30 characters
    instagramUsername: /^[a-zA-Z._]{1,30}$/,

    // Linkedin usernames can only contain a-z A-Z 0-9
    // min is 5 chars and max is 30 chars according to linkedin guidelines
    linkedinusername: /^[a-zA-Z0-9]{5,30}$/,

    // Twitter usernames can only contain a-z A-Z 0-9 and have a limit of 15 chars
    twitterUsername: /^[A-Za-z0-9_]{1,15}$/,

    // SimpleSchema Url wihout the http or https
    simpleSchemaUrlWithoutProtocol: /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,

    // facebookUrl: /^http[s]?:\/\/(www\.)?facebook\.com\/\w+(\?.*)?$/,     //old
    facebookUrl: /^http[s]?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?(\?.*)?$/, //new
    instagramUrl: /^http[s]?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?(\?.*)?$/,
    linkedinUrl: /^http[s]?:\/\/([a-zA-Z]+\.)?linkedin\.com\/(in\/[a-zA-Z0-9._-]+|pub\/.*|profile\/view)\/?(\?.*)?$/,
    twitterUrl: /^http[s]?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9._-]+\/?(\?.*)??$/,

    /**
     * Validate if the required tags are present in the string
     *
     * @param {String} string
     * @param {Array[]} requiredTags
     *
     * @return {Boolean} valid
     */
    containsRequiredTags: function(string, requiredTags) {
        var valid = true;

        requiredTags.forEach(function(tag) {
            var matches = string.match(new RegExp('\\[\\s*' + tag + '\\s*\\]', 'i'));

            if (!matches) valid = false;
        });

        return valid;
    },

    /**
     * Validate if the required tags are present in the string
     *
     * @param {String} string
     *
     * @return {Boolean} valid
     */
    containsNoHtml: function(string) {

        // Source: http://stackoverflow.com/a/15458987/2803759
        var containsHtmlTags = new RegExp('<[a-z][\\s\\S]*>', 'i');
        return !containsHtmlTags.test(string);
    },

    /**
     * Validate if the string contains urls
     *
     * @param {String} string
     *
     * @return {Boolean} valid
     */
    containsNoUrls: function(string) {

        // Source: https://github.com/kevva/url-regex
        var containsUrls = new RegExp(/(["'])?(?:(?:[a-z]+:)?\/\/)(?:\S+(?::\S*)?@)?(?:localhost|(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?\1/gi);
        return !containsUrls.test(string);
    },

    isVideoUrl: function(url) {
        // YouTube
        // http://stackoverflow.com/questions/2964678/jquery-youtube-url-validation-with-regex#10315969
        var youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        var youtubeValid = (url.match(youtubeRegex)) ? RegExp.$1 : false;

        // Vimeo
        var vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
        var vimeoValid = vimeoRegex.test(url);

        return (youtubeValid || vimeoValid);
    }
};
