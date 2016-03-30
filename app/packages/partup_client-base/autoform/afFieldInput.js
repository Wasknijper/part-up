Template.afFieldInput.onRendered(function() {
    if (this.data.focusOnRender) {
        this.find('input').focus();
    }

    if (this.data.numeric) {
        $(this.find('input')).keypress(function(e) {
            var isNumber = e.charCode >= 48 && e.charCode <= 57;
            var isSeparator = e.charCode === 44 || e.charCode === 46;
            if (!isNumber && !isSeparator) {
                e.preventDefault();
            }
        });
    }
});

Meteor.startup(function() {
    Template.autoformTags.onRendered(function() {
        var template = this;

        var inputs = template.findAll('input');

        template.hiddenInput = $(inputs[0]);
        template.visibleInput = $(inputs[1]);

        var placeholder = template.data.atts.placeholder;

        template.visibleInput.attr('placeholder', placeholder);
        template.visibleInput.attr('style', '');

        // magic to keep the input the correct width to prevent flickering
        // LORDREEKUS
        var setInputWidth = function(input) {
            var font = input.css('fontFamily');
            var fontSize = input.css('fontSize');
            var text = input.val();
            var div = $(document.createElement('div'));
            div.css({
                fontFamily: font,
                fontSize: fontSize,
                visibility: 'hidden',
                position: 'absolute',
                pointerEvents: 'none',
                width: 'auto',
                height: 'auto'
            });
            $('body').append(div);
            div.text(text);
            var width = div.width() + parseInt(fontSize);
            input.attr('style', 'width: ' + width + 'px !important;');
            input.attr('size', '');
            lodash.defer(function() {
                div.remove();
            });
        };

        template.changePlaceholder = function() {
            lodash.defer(function() {
                if (template.visibleInput.val() !== '' || template.hiddenInput.val() !== '') {
                    template.visibleInput.attr('placeholder', '');
                } else {
                    template.visibleInput.attr('placeholder', placeholder);
                }
                setInputWidth(template.visibleInput);
            });
        };

        template.hiddenInput.on('change', template.changePlaceholder);
        template.visibleInput.on('input', template.changePlaceholder);
    });

    Template.autoformTags.onDestroyed(function() {
        var template = this;
        template.hiddenInput.off('change', template.changePlaceholder);
        template.visibleInput.off('input', template.changePlaceholder);
    });
});
