/**
 * Check if an updated language is still being used
 */
Event.on('partups.language.updated', function(oldLanguage, newLanguage) {
    // Do nothing if language is the same
    if (oldLanguage === newLanguage) return;

    // Check if the old language is still being used and delete if it isn't
    var partupLanguageCount = Partups.find({language: oldLanguage}).count();
    if (partupLanguageCount < 1) {
        Languages.remove({_id: oldLanguage});
    }
});
