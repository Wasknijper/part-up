/**
 * @namespace Helpers
 * @name Partup.helpers.mentions
 * @memberOf Partup.helpers
 */
Partup.helpers.mentions = {};

/**
 * Extract mentions from a message
 *
 * @namespace Helpers
 * @name Partup.helpers.mentions.extract
 * @memberOf Partup.helpers.mentions
 *
 * @param {String} message
 *
 * @return {Array}
 */
Partup.helpers.mentions.extract = function(message) {
    var mentions = [];
    // extracts user (single) mentions
    extractUsers(message).forEach(function(mention) {
        var existingMention = lodash.find(mentions, {_id: mention._id});
        if (!existingMention) mentions.push(mention);
    });

    // extracts partners (group) mention
    extractPartners(message).forEach(function(mention) {
        var existingMention = lodash.find(mentions, {name: 'Partners'});
        if (!existingMention) mentions.push(mention);
    });

    // extracts supporters (group) mention
    extractSupporters(message).forEach(function(mention) {
        var existingMention = lodash.find(mentions, {name: 'Supporters'});
        if (!existingMention) mentions.push(mention);
    });
    return mentions;
};


/**
 * Replace mentions in a message with hyperlinks
 *
 * @namespace Helpers
 * @name Partup.helpers.mentions.decode
 * @memberOf Partup.helpers.mentions
 *
 * @param {String} message
 *
 * @return {String}
 */
Partup.helpers.mentions.decode = function(message) {
    return message.replace(/\[Supporters:(?:([^\]]+))?\]/g, function(m, users) {
        // decode supporter mentions
        var name = 'Supporters';
        return '<a data-hovercontainer="HoverContainer_upperList" data-hovercontainer-context="' + users + '" class="pu-mention-group">' + name + '</a>';
    }).replace(/\[Partners:(?:([^\]]+))?\]/g, function(m, users) {
        // decode upper mentions
        var name = 'Partners';
        return '<a data-hovercontainer="HoverContainer_upperList" data-hovercontainer-context="' + users + '" class="pu-mention-group">' + name + '</a>';
    }).replace(/\[user:([^\]|]+)(?:\|([^\]]+))?\]/g, function(m, id, name) {
        // decode invividual mentions
        return '<a href="' + Router.path('profile', {_id: id}) + '" data-hovercontainer="HoverContainer_upper" data-hovercontainer-context="' + id + '" class="pu-mention-user">' + name + '</a>';
    });
};

/**
 * Replace mentions in a message with hyperlinks
 *
 * @namespace Helpers
 * @name Partup.helpers.mentions.decodeForInput
 * @memberOf Partup.helpers.mentions
 *
 * @param {String} message
 *
 * @return {String}
 */
Partup.helpers.mentions.decodeForInput = function(message) {
    if (!message && !message.length) return '';
    return message.replace(/\[Supporters:(?:([^\]]+))?\]/g, function(m, users) {
        // decode supporter mentions
        var name = 'Supporters';
        return '@' + name;
    }).replace(/\[Partners:(?:([^\]]+))?\]/g, function(m, users) {
        // decode upper mentions
        var name = 'Partners';
        return '@' + name;
    }).replace(/\[user:([^\]|]+)(?:\|([^\]]+))?\]/g, function(m, id, name) {
        // decode invividual mentions
        return '@' + name;
    });
};

/**
 * Encode user-selected mentions into the message
 *
 * @namespace Helpers
 * @name Partup.helpers.mentions.encode
 * @memberOf Partup.helpers.mentions
 *
 * @param {String} message
 * @param {Array} mentions
 *
 * @return {String}
 */
Partup.helpers.mentions.encode = function(message, mentions) {
    mentions.forEach(function(mention, index) {
        // determine part of message to be encoded
        var find = '@' + mention.name;
        var encodedMention;
        // check if the mention is a group mention (partners/supporters) or single mention (user)
        if (mention.group) {
            var group = mention.name;
            // first part of encoded mention string -> [partners:
            encodedMention = '[' + group + ':';

            if (mention[group].length) {
                // second part of encoded mention string -> [partners:<user_id>,<user_id>,
                mention[group].forEach(function(user, index) {
                    encodedMention = encodedMention + user + ',';
                });
                // removes the last comma -> [partners:<user_id>,<user_id>
                encodedMention = encodedMention.substring(0, encodedMention.length - 1);
            } else {
                // second part of encoded mention string when there are no users -> [partners:!empty!
                // encodedMention = encodedMention + '!empty!';
            }

            // final part of encoded mention -> [partners:<user_id>,<user_id>]
            encodedMention = encodedMention + ']';

        } else {
            // encodes single mention -> [user:<user_id>:<user_name>]
            encodedMention = '[user:' + mention._id + '|' + mention.name + ']';
        }
        // finally replace mention with encoded mention
        message = replaceAll(message, find, encodedMention);
    });
    return message;
};
var replaceAll = function(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
};
/**
 * Get the true character count of a message without the encoded mess of mentions
 *
 * @namespace Helpers
 * @name Partup.helpers.mentions.getTrueCharacterCount
 * @memberOf Partup.helpers.mentions
 *
 * @param {String} message
 *
 * @return {Number}
 */
Partup.helpers.mentions.getTrueCharacterCount = function(message) {
    // set base count
    var count = message.length;
    // find all user mentions
    var userMentionsArray = userMentions(message);

    if (userMentionsArray) {
        // subtract mention count from endoced message
        userMentionsArray.forEach(function(item) {
            count = count + mentionedUserName(item).length;
        });
        count = count - combinedCount(userMentionsArray);
    }
    // find all partner mentions
    var partnerMentionsArray = partnerMentions(message);
    if (partnerMentionsArray) {
        // subtract mention count from endoced message
        partnerMentionsArray.forEach(function(item) {
            count = count + 'Partners'.length;
        });
        count = count - combinedCount(partnerMentionsArray);
    }
    // find all supporter mentions
    var supporterMentionsArray = supporterMentions(message);
    if (supporterMentionsArray) {
        // subtract mention count from endoced message
        supporterMentionsArray.forEach(function(item) {
            count = count + 'Supporters'.length;
        });
        count = count - combinedCount(supporterMentionsArray);
    }
    return count;
};

Partup.helpers.mentions.exceedsLimit = function(message) {
    var mentions = Partup.helpers.mentions.extract(message);
    var users = lodash.filter(mentions, {type: 'single'});
    if (users.length > 100) return 'tooManyUserMentions';
    var partners = lodash.find(mentions, {name: 'Partners'});
    if (partners && partners.users && partners.users.length > 100) return 'tooManyPartnerMentions';
    var supporters = lodash.find(mentions, {name: 'Supporters'});
    if (supporters && supporters.users && supporters.users.length > 100) return 'tooManySupporterMentions';
    return false;
};

// mention helpers

var mentionedUserName = function(mention) {
    return mention.match(/\[user:([^\]|]+)(?:\|([^\]]+))?\]/)[2];
};
var combinedCount = function(array) {
    var count = 0;
    array.forEach(function(mention) {
        count = count + mention.length;
    });
    return count;
};

var extractUsers = function(message) {
    var mentions = [];

    var matches = userMentions(message);
    if (!matches) return mentions;

    var match;
    for (var i = 0; i < matches.length; i++) {
        match = matches[i].match(/\[user:([^\]|]+)(?:\|([^\]]+))?\]/);
        mentions.push({
            _id: match[1],
            type: 'single',
            name: match[2]
        });
    }

    return lodash.uniq(mentions);
};
var userMentions = function(message) {
    return message.match(/\[user:[^\]|]+(?:\|[^\]]+)?\]/g);
};

var extractPartners = function(message) {
    var mentions = [];

    var matches = partnerMentions(message);
    if (!matches) return mentions;

    matches.forEach(function(match, index) {
        var singlematch = match.match(/\[Partners:(?:([^\]]+))?\]/);
        var users = singlematch[1] ? singlematch[1].split(',') : [];
        mentions.push({
            type: 'group',
            users: lodash.uniq(users),
            name: 'Partners'
        });
    });

    return mentions;
};
var partnerMentions = function(message) {
    return message.match(/\[Partners:(?:([^\]]+))?\]/g);
};

var extractSupporters = function(message) {
    var mentions = [];

    var matches = supporterMentions(message);
    if (!matches) return mentions;

    matches.forEach(function(match, index) {
        var singlematch = match.match(/\[Supporters:(?:([^\]]+))?\]/);
        var users = singlematch[1] ? singlematch[1].split(',') : [];
        mentions.push({
            type: 'group',
            users: lodash.uniq(users),
            name: 'Supporters'
        });
    });

    return mentions;
};
var supporterMentions = function(message) {
    return message.match(/\[Supporters:(?:([^\]]+))?\]/g);
};
