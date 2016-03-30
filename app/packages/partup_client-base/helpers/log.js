Template.registerHelper('log', function() {

    // Slicing the last argument away (Spacebars object)
    var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

    // Logging the passed arguments
    console.log.apply(console, args);

});
