// config.js
require('dotenv').config({ path: __dirname + '/./../.env' })
// dotenv.config();
module.exports = {
    clientID: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
};