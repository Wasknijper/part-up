var winston = Npm.require('winston');

var transports = [];

if (process.env.NODE_ENV.match(/development|staging|acceptance/)) {
    transports.push(new (winston.transports.Console)({level: 'debug', prettyPrint: true, colorize: true, debugStdout: true}));
}

if (process.env.NODE_ENV === 'production') {
    transports.push(new (winston.transports.Console)({level: 'warn'}));
}

Log = new (winston.Logger)({transports: transports});

Debug = function(namespace) {
    var debug = Npm.require('debug')('partup:' + namespace);
    debug.log = console.info.bind(console);
    debug.useColors = true;
    return debug;
};
