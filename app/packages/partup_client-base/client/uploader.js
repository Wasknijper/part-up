// Settings
//
var MAX_IMAGE_WIDTH = 1500;
var MAX_IMAGE_HEIGHT = 1500;

Partup.client.uploader = {

    /**
     * Upload single image
     *
     * @memberOf Partup.client
     * @param {Object} file
     * @param {Function} callback
     */
    uploadImage: function(file, callback) {
        var img = document.createElement('img');
        var canvas = document.createElement('canvas');
        var self = this;

        var IE = this.isIE();
        var SAFARI = this.isSafari();

        var userId = Meteor.userId();

        if (IE) {
            var reader = new mOxie.FileReader();
        } else {
            var reader = new FileReader();
        }
        reader.onload = function(e) {
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);

        img.onload = function() {
            var width = img.naturalWidth;
            var height = img.naturalHeight;

            if (width > height) {
                if (width > MAX_IMAGE_WIDTH) {
                    height *= MAX_IMAGE_WIDTH / width;
                    width = MAX_IMAGE_WIDTH;
                }
            } else {
                if (height > MAX_IMAGE_HEIGHT) {
                    width *= MAX_IMAGE_HEIGHT / height;
                    height = MAX_IMAGE_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            var dataUrl;
            if (img.src.indexOf('image/png') > -1) {
                dataUrl = canvas.toDataURL('image/png');
            } else {
                dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            }

            var resizedFile = self.dataURLToBlob(dataUrl);

            if (IE || SAFARI) {
                resizedFile.name = file.name;
                var newFile = new mOxie.File(null, resizedFile);
            } else {
                var newFile = new File([resizedFile], file.name);
            }

            var token = Accounts._storedLoginToken();
            if (IE || SAFARI) {
                var xhr = new mOxie.XMLHttpRequest();
            } else {
                var xhr = new XMLHttpRequest();
            }
            var location = window.location.origin ? window.location.origin : window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            var url = location + '/images/upload?token=' + token;
            xhr.open('POST', url, true);

            if (IE || SAFARI) {
                var formData = new mOxie.FormData();
            } else {
                var formData = new FormData();
            }
            formData.append('file', newFile);

            var loadHandler = function(e) {
                var data = JSON.parse(xhr.responseText);
                if (data.error) {
                    callback(data.error);
                    return;
                }
                Meteor.subscribe('images.one', data.image);
                Meteor.autorun(function(computation) {
                    var image = Images.findOne({_id: data.image});
                    if (image) {
                        computation.stop();
                        Tracker.nonreactive(function() {
                            callback(null, image);
                        });
                    }
                });
                xhr.removeEventListener('load', loadHandler);
                xhr.removeEventListener('error', errorHandler);
            };

            var errorHandler = function(e) {
                xhr.removeEventListener('load', loadHandler);
                xhr.removeEventListener('error', errorHandler);
            };

            xhr.addEventListener('load', loadHandler);
            xhr.addEventListener('error', errorHandler);

            xhr.send(formData);
        };
    },

    /**
     * Return a blob from dataurl
     *
     * @memberOf Partup.client
     * @param {DataUrl} canvas dataurl
     */

    dataURLToBlob: function(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = decodeURIComponent(parts[1]);

            return new Blob([raw], {type: contentType});
        }

        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    },

    /**
     * Loop through each file in a file input select event
     *
     * @memberOf Partup.client
     * @param {Object} fileSelectEvent
     * @param {Function} callback
     */
    eachFile: function(fileSelectEvent, callBack) {
        var e = (fileSelectEvent.originalEvent || fileSelectEvent);
        var files = e.target.files;

        if (!files || files.length === 0) {
            files = e.dataTransfer ? e.dataTransfer.files : [];
        }

        for (var i = 0; i < files.length; i++) {
            callBack(files[i]);
        }
    },

    /**
     * Upload single image by url
     *
     * @memberOf Partup.client
     * @param {String} url
     * @param {Function} callback
     */
    uploadImageByUrl: function(url, callback) {
        Meteor.call('images.insertByUrl', url, function(error, result) {
            if (error || !result) return callback(error);

            Meteor.subscribe('images.one', result._id, function() {
                Meteor.autorun(function(computation) {
                    var image = Images.findOne({_id: result._id});
                    if (image) {
                        computation.stop();
                        Tracker.nonreactive(function() {
                            callback(null, image);
                        });
                    }
                });
            });
        });
    },

    /**
     * Create file input, uses FileReader polyfill for unsupported brwosers
     *
     * @memberOf Partup.client
     * @param {Object} options
     * @param {Element} options.buttonElement
     * @param {Element} options.fileInput
     * @param {Boolean} options.multiple
     */
    create: function(options) {
        var buttonElement = options.buttonElement || null;
        var fileInput = options.fileInput || null;
        var multiple = options.multiple || false;
        var isIE = this.isIE();
        if (isIE) {
            fileInput = new mOxie.FileInput({
                browse_button: buttonElement, // or document.getElementById('file-picker')
                accept: [
                    {title: 'Image files', extensions: 'jpg,gif,png'} // accept only images
                ],
                multiple: multiple, // allow multiple file selection
                runtime_order: 'flash,silverlight,html4,html5',
            });
            fileInput.onchange = function(event) {
                options.onFileChange(event);
            };
            fileInput.init();
        } else {
            buttonElement.addEventListener('click', function(event) {
                event.preventDefault();
                $(fileInput).click();
            });
            fileInput.addEventListener('change', function(event) {
                options.onFileChange(event);
            });
        }

    },

    isIE: function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
        }

        if (/Edge/.test(navigator.userAgent)) {
            // this is Microsoft Edge
            return true;
        }

        return false;
    },

    isSafari: function() {
        var ua = window.navigator.userAgent;

        var is_chrome = ua.indexOf('Chrome') > -1;
        var is_safari = ua.indexOf('Safari') > -1;

        // Chrome has both "Chrome" and "Safari" in the string.
        // Safari only has "Safari".
        if (is_chrome && is_safari) {
            is_safari = false;
        }

        return is_safari;
    }

};
