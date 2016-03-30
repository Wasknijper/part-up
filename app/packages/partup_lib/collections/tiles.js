/**
 * @ignore
 */
var Tile = function(document) {
    _.extend(this, document);
};

/*
    supported formats are
    http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
    http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
    http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
    http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
    http://www.youtube.com/embed/0zM3nApSvMg?rel=0
    http://www.youtube.com/watch?v=0zM3nApSvMg
    http://youtu.be/0zM3nApSvMg
*/

var getYoutubeIdFromUrl = function(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return false;
    }
};
/*
    supported formats are
    http://vimeo.com/6701902
    http://vimeo.com/670190233
    http://player.vimeo.com/video/67019023
    http://player.vimeo.com/video/6701902
    http://player.vimeo.com/video/67019022?title=0&amp;byline=0&amp;portrait=0
    http://player.vimeo.com/video/6719022?title=0&amp;byline=0&amp;portrait=0
    http://vimeo.com/channels/vimeogirls/6701902
    http://vimeo.com/channels/vimeogirls/67019023
    http://vimeo.com/channels/staffpicks/67019026
    http://vimeo.com/15414122
    http://vimeo.com/channels/vimeogirls/66882931
*/

var getVimeoIdFromUrl = function(url) {
    var regExp = /(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
    var match = url.match(regExp);
    if (match && match[5]) {
        return match[5];
    } else {
        return false;
    }
};
/**
 * Returns the embedsettings for vimeo or youtube
 *
 * @memberof Tiles
 * @return {Object} embed type and type id
 */
Tile.prototype.embedSettings = function() {
    var settings = {};
    // Vimeo settings
    if (this.video_url.indexOf('vimeo') > -1) {
        settings.type = 'vimeo';
        settings.vimeo_id = getVimeoIdFromUrl(this.video_url);
    }
    // YouTube settings
    if (this.video_url.indexOf('youtube') > -1 || this.video_url.indexOf('youtu.be') > -1) {
        settings.type = 'youtube';
        settings.youtube_id = getYoutubeIdFromUrl(this.video_url);
    }
    return settings;
};

/**
 @namespace Tiles
 @name Tiles
 */
Tiles = new Mongo.Collection('tiles', {
    transform: function(document) {
        return new Tile(document);
    }
});
