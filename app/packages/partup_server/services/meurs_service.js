var d = Debug('services:meurs');

var meursCall = function(url, data) {
    try {
        var result = HTTP.post(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: data
        });

        if (result.statusCode !== 200 || result.data.errors.length > 0) {
            // Check if there is a fallback that can save the day
            var error = result.data.errors[0]; // Always just 1 error
            if (error.code == 59 && error.messageProp == 'authenticatorErrorInvalidUsernameExists') {
                // User already has a q4youId, so let's find and return it
                var q4youId = Partup.server.services.meurs.getExistingQ4youId(data.authToken, data.userName);
                if (q4youId) {
                    // Set the retrieved ID
                    result.data.q4youID = q4youId;
                    return result;
                }
            }

            Log.error('[Meurs API Error] Url: [' + url + ']. Status code: [' + result.statusCode + ']. Errors: ', result.data.errors);
            throw new Meteor.Error(400, '[Meurs API Error] Url: [' + url + ']. Status code: [' + result.statusCode + ']. Errors: ', result.data.errors);
        }

        // No errors
        return result;
    } catch (error) {
        Log.error(error);
        throw new Meteor.Error(400, '[Meurs API Exception] Url: [' + url + ']. Errors: ', error);
    }
};

/**
 @namespace Partup server meurs service
 @name Partup.server.services.meurs
 @memberof Partup.server.services
 */
Partup.server.services.meurs = {
    getToken: function(portal) {
        var apiKey = process.env.MEURS_EN_API_KEY;
        var apiSecret = process.env.MEURS_EN_API_SECRET;

        if (portal === 'nl') {
            apiKey = process.env.MEURS_NL_API_KEY;
            apiSecret = process.env.MEURS_NL_API_SECRET;
        }

        var result = meursCall(process.env.MEURS_BASE_URL + 'authenticator/api/authenticate', {
            apiKey: apiKey,
            apiSecret: apiSecret
        });

        return result.data.authToken;
    },

    addUser: function(token, userId, email) {
        if (!token) {
            d('No authentication token given');
            throw new Meteor.Error(400, 'Token needed for Meurs API');
        }

        var result = meursCall(process.env.MEURS_BASE_URL + 'authenticator/api/adduser', {
            authToken: token,
            userName: userId,
            password: '@1Aa' + Random.id(),
            email: email.replace('+', '')
        });

        return result.data.q4youID;
    },

    activateUser: function(token, q4youId) {
        if (!token) {
            d('No authentication token given');
            throw new Meteor.Error(400, 'Token needed for Meurs API');
        }

        var result = meursCall(process.env.MEURS_BASE_URL + 'authenticator/api/activateuser', {
            authToken: token,
            q4youID: q4youId
        });

        return result.data.errors.length < 1;
    },

    getExistingQ4youId: function(token, userName) {
        if (!token) {
            d('No authentication token given');
            throw new Meteor.Error(400, 'Token needed for Meurs API');
        }

        var result = meursCall(process.env.MEURS_BASE_URL + 'authenticator/api/getusers', {
            authToken: token
        });

        var user = lodash.find(result.data.users, function(user) {
            return user.userName == userName;
        });

        return user.id;
    },

    createProgramSessionId: function(portal, token, q4youId) {
        if (!token) {
            d('No authentication token given');
            throw new Meteor.Error(400, 'Token needed for Meurs API');
        }

        var templateId = portal === 'en' ? process.env.MEURS_EN_PROGRAM_TEMPLATE_ID : process.env.MEURS_NL_PROGRAM_TEMPLATE_ID;

        var result = meursCall(process.env.MEURS_BASE_URL + 'q4u/api/createprogramsession', {
            authToken: token,
            q4youID: q4youId,
            programTemplateId: templateId
        });

        return result.data.programSessionId;
    },

    setActiveProgramSession: function(token, q4youId, programSessionId) {
        if (!token) {
            d('No authentication token given');
            throw new Meteor.Error(400, 'Token needed for Meurs API');
        }

        var result = meursCall(process.env.MEURS_BASE_URL + 'q4u/api/setactiveprogramsession', {
            authToken: token,
            q4youID: q4youId,
            programSessionId: programSessionId
        });

        return result.data.errors.length < 1;
    },

    getBrowserToken: function(portal, token, q4youId, returnUrl) {
        if (!token) {
            d('No authentication token given');
            throw new Meteor.Error(400, 'Token needed for Meurs API');
        }

        var serviceId = portal === 'en' ? process.env.MEURS_EN_SERVICE_ID : process.env.MEURS_NL_SERVICE_ID;

        var result = meursCall(process.env.MEURS_BASE_URL + 'q4u/api/getbrowsertoken', {
            authToken: token,
            q4youID: q4youId,
            returnUrl: returnUrl,
            startPageId: 1,
            autoStartServiceId: serviceId
        });

        return result.data.url;
    },

    getServiceSessionData: function(token, q4youId, programSessionId) {
        if (!token) {
            d('No authentication token given');
            throw new Meteor.Error(400, 'Token needed for Meurs API');
        }

        var sessionStatus = meursCall(process.env.MEURS_BASE_URL + 'q4u/api/getservicesessionstatus', {
            authToken: token,
            userIdList: [q4youId]
        });

        // Get the active session data
        var activeSessionData = {};
        sessionStatus.data.result.forEach(function(sessionData) {
            if (sessionData.programSessionId == programSessionId) {
                activeSessionData = sessionData;
            }
        });

        return activeSessionData;
    },

    getResults: function(token, serviceSessionId) {
        if (!token) {
            d('No authentication token given');
            throw new Meteor.Error(400, 'Token needed for Meurs API');
        }

        var sessionResult = meursCall(process.env.MEURS_BASE_URL + 'q4u/api/getservicesessionsresults', {
            authToken: token,
            serviceSessionIds: [serviceSessionId]
        });

        return sessionResult.data.result[0].data.result[0].varScores;
    }
};
