Template.registerHelper('partupEquals', function(a, b) {
    return (a == b);
});

Template.registerHelper('partupEqualsExactly', function(a, b) {
    return (a === b);
});

Template.registerHelper('partupNotEquals', function(a, b) {
    return (a != b);
});

Template.registerHelper('partupNotEqualsExactly', function(a, b) {
    return (a !== b);
});

Template.registerHelper('partupEitherEquals', function(a, b, c) {
    return (a == b || a == c);
});

Template.registerHelper('partupHasTrueValues', function(object) {
    var empty = false;
    _.each(object, function(value) {
        if (value) empty = true;
    });
    return empty
});

Template.registerHelper('partupHigherThan', function(a, b) {
    return (a > b);
});

Template.registerHelper('partupLowerThan', function(a, b) {
    return (a < b);
});

Template.registerHelper('partupContains', function(a, b) {
    return a.indexOf(b) > -1;
});

Template.registerHelper('partupContainsOne', function(a, b) {
    if (!a || !b) return false;

    var contains = false;
    for (var i = 1; i < arguments.length; i++) {
        if (a.indexOf(arguments[i]) > -1) {
            contains = true;
        }
    };
    return contains;
});

Template.registerHelper('partupOneIsTrue', function(a, b) {
    if (a) return true;
    if (b) return true;
    return false;
});

Template.registerHelper('partupAllAreTrue', function() {
    var allAreTrue = true;
    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i]) {
            allAreTrue = false;
        }
    };
    return allAreTrue;
});
