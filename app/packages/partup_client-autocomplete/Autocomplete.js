// Waiting untill this issue has been fixed...
// https://github.com/twitter/typeahead.js/issues/1324

Template.Autocomplete.onRendered(function() {
    var tpl = this;

    // Autocomplete: debounced Meteor.call for autocomplete results
    var autocomplete = lodash.debounce(function(query, sync, async) {
        if (tpl.data.onQuery) tpl.data.onQuery(query, sync, async);
    }, 250, {
        maxWait: 1000
    });

    // Autocomplete: find the queryfield
    tpl.query_field = tpl.find('input');
    // No queryfield found? Stop here.
    if (!tpl.query_field) return;

    // Autocomplete: jQuerify query fields
    var jq_query_field = $(tpl.query_field);

    // Autocomplete: set attributes on input field
    jq_query_field.addClass('typeahead');
    jq_query_field.attr('autocomplete', 'off');
    jq_query_field.attr('autocorrect', 'off');
    jq_query_field.attr('autocapitalize', 'off');
    jq_query_field.attr('spellcheck', 'off');
    jq_query_field.attr('data-min-length', '2');
    jq_query_field.attr('data-limit', '4');

    // Autocomplete: initialize using Meteor.typeahead
    Meteor.typeahead(tpl.query_field, function(query, sync, async) {
        autocomplete(query, sync, async);
    });

    // Autocomplete on select
    jq_query_field.on('typeahead:select', function(event, suggestion) {
        if (tpl.data.onSelect) tpl.data.onSelect(suggestion);
    });

    // Autocomplete on open
    jq_query_field.on('typeahead:open', function() {
        if (tpl.data.onOpen) tpl.data.onOpen();
    });

    // Autocomplete on close
    jq_query_field.on('typeahead:close', function() {
        if (tpl.data.onClose) tpl.data.onClose();
    });
});
