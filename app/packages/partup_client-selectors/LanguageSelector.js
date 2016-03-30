var STUB_LANGUAGES = [
    {
        _id: 'nl',
        native_name: 'Nederlands'
    }, {
        _id: 'en',
        native_name: 'English'
    }
];
Template.LanguageSelector.onCreated(function() {
    var tpl = this;
    tpl.subscribe('languages.all', function() {
        tpl.languages = Languages.find().fetch();
    });

    // When the value changes, notify the parent using the onSelect callback
    this.currentLanguage = new ReactiveVar(false, function(a, value) {
        if (!value) return;
        var language = lodash.find(tpl.languages, {_id: value});
        if (tpl.data.onSelect) tpl.data.onSelect(language);
    });

    // Suggested languages
    tpl.suggestedLanguages = new ReactiveVar();
    tpl.autorun(function() {
        var languages = Languages.find().fetch();
        if (!languages || !languages.length) languages = STUB_LANGUAGES;
        tpl.suggestedLanguages.set(languages);
    });
});

Template.LanguageSelector.helpers({languages: function() {
        return Languages.find();
    }
});

Template.LanguageSelector.events({
    'click [data-select-language]': function(event, template) {
        event.preventDefault();
        var languages = template.suggestedLanguages.get();
        if (!languages || !languages.length) return;

        var value = event.currentTarget.getAttribute('data-select-language');
        var language = lodash.find(template.languages, {_id: value});

        template.currentLanguage.set(value);
        if (template.data.onSelect) template.data.onSelect(language);
    }
});
