/**
 * Mentions suggestions while typing
 *
 * @param {Element} input
 */
var MentionsInput = function(input, partupId, options) {
    var options = options || {};
    if (!(this instanceof MentionsInput)) {
        return new MentionsInput(input, partupId, options);
    }
    this.autoFocus = options.autoFocus || false;
    this.prefillValue = options.prefillValue || undefined;
    this.autoAjustHeight = options.autoAjustHeight || false;
    this.partupId = partupId || false;
    this.input = input;
    this.setValue(this.prefillValue);
    this._build();
    this._setEvents();
};

var mentionRegex = /(?:^|[\s\[\]\^\$\.\|\?\*\+\(\)\\~`\!@#%&\-_+={}'""<>:;,]+)@([^\s@]{3,}[^\s]{0,}[\s]?[^\s\[\]\^\$\.\|\?\*\+\(\)\\~`\!@#%&\-_+={}'""<>:;,]{0,})$/i;

/**
 * Build required elements
 */
MentionsInput.prototype._build = function() {
    if (this.wrap) return;

    var wrap = document.createElement('div');
    wrap.classList.add('pu-input-mentions-wrap');

    this.input.parentNode.insertBefore(wrap, this.input);
    wrap.appendChild(this.input);

    var suggestionsEl = document.createElement('div');
    suggestionsEl.classList.add('pu-input-mentions-suggestions');
    wrap.appendChild(suggestionsEl);

    this.suggestionsEl = suggestionsEl;
    this.wrap = wrap;
};

/**
 * Set required events on the input
 */
MentionsInput.prototype._setEvents = function() {
    var self = this;
    self.keyDownHandler = function(e) {
        if (!self.isSuggestionsShown || [38, 40, 13, 27].indexOf(e.keyCode) === -1) {
            return;
        }
        e.preventDefault();

        switch (e.keyCode) {
            case 38: // arrow up
                self.highlight(self.selectedIndex - 1);
            break;
            case 40: // arrow down
                self.highlight(self.selectedIndex + 1);
            break;
            case 13: // enter
                self.select(self.selectedIndex);
                e.stopPropagation();
            break;
            case 27:
                self.hideSuggestions();
            break;
        }
    };

    self.inputHandler = function(e) {
        self.checkCaretPosition();
    };

    self.blurHandler = function() {
        setTimeout(function() {
            self.hideSuggestions();
        }, 500);
    };

    self.clickHandler = function(e) {
        self.select(self.btns.indexOf(e.target));
    };

    self.input.addEventListener('keydown', self.keyDownHandler);
    self.input.addEventListener('input', self.inputHandler);
    self.input.addEventListener('blur', self.blurHandler);
    self.suggestionsEl.addEventListener('click', self.clickHandler);
    if (self.autoFocus) self.input.focus();
};

/**
 * Select an item in the list by index
 */
MentionsInput.prototype.select = function(index) {
    var suggestion = this.suggestions[index];
    if (!suggestion) {
        this.hideSuggestions();
        return;
    }
    var suggestionName = suggestion.name || suggestion.profile.name;

    var substr = this.input.value.substr(0, this.input.selectionStart);
    var match = substr.match(mentionRegex);

    if (!match) return;
    if (suggestion.type) {
        var users = [];
        for (var i = 0; i < suggestion.users.length; i++) {
            users.push(suggestion.users[i]._id);
        };
        this.mentions[suggestionName] = users;
    } else {
        this.mentions[suggestionName] = suggestion._id;
    }

    var value = this.input.value;
    var start = substr.length - match[1].length;
    var pre = value.substring(0, start);
    var post = value.substring(this.input.selectionStart, value.length);

    this.input.value = pre + suggestionName + ' ' + post;

    this.input.selectionStart = this.input.selectionEnd = (pre + suggestionName).length;
    this.input.focus();
    this.hideSuggestions();
};

/**
 * Highlight an item in the list by index
 */
MentionsInput.prototype.highlight = function(index) {
    if (!this.btns[index]) return;

    if (this.selectedIndex > -1) {
        this.btns[this.selectedIndex].classList.remove('pu-state-highlight');
    }

    this.btns[index].classList.add('pu-state-highlight');
    this.selectedIndex = index;
};

/**
 * Show the suggestion list
 */
MentionsInput.prototype.showSuggestions = function() {
    this.suggestionsEl.classList.add('pu-state-visible');
    this.isSuggestionsShown = true;
};

/**
 * Hide the suggestion list
 */
MentionsInput.prototype.hideSuggestions = function() {
    this.suggestionsEl.classList.remove('pu-state-visible');
    this.isSuggestionsShown = false;
    this.lastQuery = null;
    this.selectedIndex = -1;
};

/**
 *
 */
MentionsInput.prototype.checkCaretPosition = function() {
    var substr = this.input.value.substr(0, this.input.selectionStart);
    var match = substr.match(mentionRegex);

    if (!match) {
        this.hideSuggestions();
        return;
    }

    this.showSuggestions();

    var query = match[1];
    if (/\s$/.test(query)) return; // check for endspace
    if (query === this.lastQuery) return; // check for same query

    var group = undefined;
    var partupId = this.partupId;
    if ('partners'.indexOf(query.toLowerCase()) > -1) group = 'partners';
    if ('supporters'.indexOf(query.toLowerCase()) > -1) group = 'supporters';

    var self = this;
    Meteor.call('users.autocomplete', query, group, partupId, function(error, users) {
        if (error) {
            console.error(error);
            return;
        }

        self.suggestions = users.slice(0, 10);

        self.lastQuery = query;
        self.suggestionsEl.innerHTML = '';
        self.btns = [];

        if (!self.suggestions.length) {
            var emptyEl = document.createElement('span');
            emptyEl.classList.add('pu-input-mentions-suggestions-empty');
            emptyEl.textContent = TAPi18n.__('base-client-language-mention-input-empty');
            self.suggestionsEl.appendChild(emptyEl);
            return;
        }

        var suggestion;
        var btn;
        for (var i = 0; i < self.suggestions.length; i++) {
            suggestion = self.suggestions[i];
            btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.type = suggestion.type || undefined;
            btn.dataset.id = suggestion._id || undefined;
            btn.textContent = suggestion.name || suggestion.profile.name;
            self.btns.push(btn);
            self.suggestionsEl.appendChild(btn);
        }

        self.highlight(0);
    });
};

/**
 *
 */
MentionsInput.prototype.getValue = function() {
    var mentions = lodash.map(this.mentions, function(value, key) {
        if (Array.isArray(value)) {
            var obj = {
                name: key,
                group: true
            };
            obj[key] = value;
            return obj;
        }
        return {
            _id: value,
            name: key
        };
    });
    var encoded = Partup.helpers.mentions.encode(this.input.value, mentions);
    return encoded;
};

MentionsInput.prototype.setValue = function(prefillValue) {
    var encodedMessage = prefillValue || '';
    var self = this;
    var mentions = {};
    var extractedMentions = Partup.helpers.mentions.extract(encodedMessage);
    extractedMentions.forEach(function(item) {
        if (item.type === 'group') {
            mentions[item.name] = item.users;
            return;
        }
        mentions[item.name] = item._id;
    });
    self.input.value = Partup.helpers.mentions.decodeForInput(encodedMessage);
    if (self.autoAjustHeight) self.input.style.minHeight = self.input.scrollHeight + 'px';
    self.mentions = mentions;
};

MentionsInput.prototype.reset = function() {
    this.mentions = {};
    this.autoAjustHeight = false;
    this.autoFocus = false;
};

MentionsInput.prototype.destroy = function() {
    var self = this;
    self.input.removeEventListener('keydown', self.keyDownHandler);
    self.input.removeEventListener('input', self.inputHandler);
    self.input.removeEventListener('blur', self.blurHandler);
    self.suggestionsEl.removeEventListener('click', self.clickHandler);
    this.mentions = {};
    this.autoAjustHeight = false;
    this.autoFocus = false;
};

Partup.client.forms.MentionsInput = MentionsInput;
