// Load the colors on the String prototype now, so we can use
// things like 'this is a string'.gray in the console.
var colors = Npm.require('colors');

ServiceConfiguration.configurations.upsert({
    service: 'facebook'
}, {
    $set: {
        appId: process.env['FACEBOOK_APP_ID'],
        loginStyle: 'popup',
        secret: process.env['FACEBOOK_APP_SECRET']
    }
});

ServiceConfiguration.configurations.upsert({
    service: 'linkedin'
}, {
    $set: {
        clientId: process.env['LINKEDIN_API_KEY'],
        loginStyle: 'popup',
        secret: process.env['LINKEDIN_SECRET_KEY']
    }
});

Router.route('/ping', function() {
    this.response.end('partupok');
}, {where: 'server'});

// Kick off the cronjobs
SyncedCron.start();

// Configure AWS
AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.region = process.env.AWS_BUCKET_REGION;

// Browser Policy
Meteor.startup(function() {

    // Content allows
    BrowserPolicy.content.allowEval();
    BrowserPolicy.content.allowOriginForAll('*');

    // Disallow being framed by other sites
    BrowserPolicy.framing.disallow();

    // When in development mode, we need to be able to be framed by Velocity
    if (process.env.NODE_ENV.match(/development/)) {
        var VELOCITY_ORIGIN = 'http://localhost:49371';

        BrowserPolicy.framing.restrictToOrigin(VELOCITY_ORIGIN);
    }
});
