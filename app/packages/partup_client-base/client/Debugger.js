// Debugger constructor
Partup.client.Debugger = function(options) {
    var self = this;
    var options = options || {};
    var defaultNamespace = 'DEBUGGER';

    // check if enabled option is set
    self.enabled = options.enabled;

    // output error if no namespace for the debugger is set
    if (!options.namespace) console.warn('Debugger namespace is undefined, set to "' + defaultNamespace + '"');

    // set debugger namespace (uppercase cuz I like)
    self.namespace = options.namespace ? options.namespace.toUpperCase() : defaultNamespace;

    // generate the namespace string color
    if (options.color) {
        self.color = options.color;
    } else {
        if (self.namespace !== defaultNamespace) {
            self.color = self.generateNamespaceColor(self.namespace);
        } else {
            self.color = '#ffa725';
        }
    }
};
// log method
Partup.client.Debugger.prototype.log = function() {
    var self = this;
    // do not output anything if not enabled
    if (!self.enabled) return false;

    var args = self.generateArguments(arguments);

    // output console.log
    return console.log.apply(console, args);
};
// generate arguments
Partup.client.Debugger.prototype.generateArguments = function(arguments) {
    var self = this;
    // generate a color for the namespace
    var color = 'color:' + self.color + ';font-weight:bold;';

    // put all log arguments into an array
    var args = Array.prototype.slice.call(arguments);

    // prepend the console styling
    args.unshift(self.namespace + ':');

    var isIE = self.isIE();
    if (!isIE) {
        args.unshift(color);
        args.unshift('%c%s');
    }
    return args;
};
// namespace color generator
Partup.client.Debugger.prototype.generateNamespaceColor = function(string) {
    var hashCode = function(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };
    var intToRGB = function(i) {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        return '00000'.substring(0, 6 - c.length) + c;
    };
    return '#' + intToRGB(hashCode(string));
};

Partup.client.Debugger.prototype.isIE = function() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        return true;
    }
    return false;
};
