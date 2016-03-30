var path = Npm.require('path');
var Busboy = Npm.require('busboy');

AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.region = process.env.AWS_BUCKET_REGION;

var MAX_FILE_SIZE = 1000 * 1000 * 10; // 10 MB

Router.route('/images/upload', {where: 'server'}).post(function() {
    var request = this.request;
    var response = this.response;
    // console.log(request)

    // We are going to respond in JSON format
    response.setHeader('Content-Type', 'application/json');

    var busboy = new Busboy({'headers': request.headers});

    busboy.on('file', Meteor.bindEnvironment(function(fieldname, file, filename, encoding, mimetype) {
        var extension = path.extname(filename);
        var imageExtension = (/\.(jpg|jpeg|png)$/i).test(extension);
        var imageMimetype = (/\/(jpg|jpeg|png)$/i).test(mimetype);

        if (!imageExtension && imageMimetype) {
            filename = filename + '.jpg';
        }

        // Validate that the file is a valid image
        if (!imageExtension && !imageMimetype) {
            response.statusCode = 400;
            // TODO: Improve error message (i18n)
            response.end(JSON.stringify({error: {reason:'error-imageupload-invalidimage'}}));
            return;
        }
        var size = 0;
        var buffers = [];

        file.on('data', Meteor.bindEnvironment(function(data) {
            size += data.length;
            buffers.push(new Buffer(data));
        }));

        file.on('end', Meteor.bindEnvironment(function() {
            if (size > MAX_FILE_SIZE) {
                response.statusCode = 400;
                // TODO: Improve error message (i18n)
                response.end(JSON.stringify({error: {reason: 'error-imageupload-toolarge'}}));
                return;
            }
            var body = Buffer.concat(buffers);
            var image = Partup.server.services.images.upload(filename, body, mimetype);

            return response.end(JSON.stringify({error: false, image: image._id}));
        }));
    }));

    request.pipe(busboy);
});
