/*************************************************************/
/* Widget initial */
/*************************************************************/
Template.modal_create_promote.onRendered(function() {
    var template = this;

    var elm = template.find('[data-copy-to-clipboard]');

    // Copy to clipboard
    Partup.client.clipboard.applyToElement(elm, elm.value, function onCopySuccess() {
        Partup.client.notify.success(TAPi18n.__('pages-modal-create-promote-notify-copy-to-clipboard-success'));
    }, function onCopyError() {
        Partup.client.notify.error(TAPi18n.__('pages-modal-create-promote-notify-copy-to-clipboard-error'));
    });

    template.autorun(function() {
        var partup = Partups.findOne({_id: template.data.partupId});

        if (partup) {
            var image = Images.findOne({_id: partup.image});

            if (image) {
                var focuspointElm = template.find('[data-partupcover-focuspoint]');
                template.focuspoint = new Focuspoint.View(focuspointElm, {
                    x: mout.object.get(image, 'focuspoint.x'),
                    y: mout.object.get(image, 'focuspoint.y')
                });
            }
        }
    });
});

Template.modal_create_promote.onCreated(function() {
    this.subscribe('partups.one', this.data.partupId);

    var template = this;

    template.shared = new ReactiveVar({
        twitter: false,
        facebook: false,
        linkedin: false
    });
});

/*************************************************************/
/* Widget helpers */
/*************************************************************/
Template.modal_create_promote.helpers({
    Partup: Partup,
    partup: function() {
        return Partups.findOne({_id: this.partupId});
    },
    partupUrl: function() {
        var partup = Partups.findOne({_id: this.partupId});
        if (!partup) return;

        return Router.url('partup', {slug: partup.slug});
    },
    shared: function() {
        return Template.instance().shared.get();
    },
    fixFooter: function() {
        return Partup.client.scroll.pos.get() < Partup.client.scroll.maxScroll() - 50;
    }
});

/*************************************************************/
/* Widget events */
/*************************************************************/
Template.modal_create_promote.events({

    'click [data-share]': function sharePartup(event, template) {
        var socialTarget = $(event.currentTarget).data('share');
        var sharedSocials = template.shared.get();

        if (!sharedSocials[socialTarget]) {
            sharedSocials[socialTarget] = true;
            template.shared.set(sharedSocials);
        }
    },

    'click [data-copy-to-clipboard]': function eventCopyToClipboard(event) {
        var elm = event.currentTarget;

        // Select elements text
        elm.select();
    },

    'click [data-action-topartup]': function eventToPartup(event, template) {
        event.preventDefault();

        var partup = Partups.findOne({_id: template.data.partupId});
        Intent.return('create', {
            arguments: [partup.slug],
            fallback_route: {
                name: 'partup',
                params: {
                    slug: partup.slug
                }
            }
        });
    },

    'click [data-share-facebook]': function clickShareFacebook(event, template) {
        var partup = Partups.findOne({_id: template.data.partupId});
        var url = Router.url('partup', {slug: partup.slug});

        var facebookUrl = Partup.client.socials.generateFacebookShareUrl(url);
        window.open(facebookUrl, 'pop', Partup.client.window.getPopupWindowSettings());

        analytics.track('promote share facebook', {
            partupId: partup._id,
        });
    },

    'click [data-share-twitter]': function clickShareTwitter(event, template) {
        var partup = Partups.findOne({_id: template.data.partupId});
        var url = Router.url('partup', {slug: partup.slug});

        var message = partup.name;
        var twitterUrl = Partup.client.socials.generateTwitterShareUrl(message, url);
        window.open(twitterUrl, 'pop', Partup.client.window.getPopupWindowSettings());

        analytics.track('promote share twitter', {
            partupId: partup._id,
        });
    },

    'click [data-share-linkedin]': function clickShareLinkedin(event, template) {
        var partup = Partups.findOne({_id: template.data.partupId});
        var url = Router.url('partup', {slug: partup.slug});

        var linkedInUrl = Partup.client.socials.generateLinkedInShareUrl(url);
        window.open(linkedInUrl, 'pop', Partup.client.window.getPopupWindowSettings());

        analytics.track('promote share linkedin', {
            partupId: partup._id,
        });
    }

});
