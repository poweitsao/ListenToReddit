const snoowrap = require('snoowrap');
const { clientID, clientSecret, refreshToken } = require('../config.js')

const r = new snoowrap({
    userAgent: 'my-user-agent',
    clientId: clientID,
    clientSecret: clientSecret,
    refreshToken: refreshToken
});

module.exports = r