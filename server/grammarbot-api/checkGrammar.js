var unirest = require("unirest");

var req = unirest("", "https://");

req.headers({
    "x-rapidapi-key": "a7cb3c0e06msh98c21b84378ef43p1eefd9jsn27ac967779e9",
    "content-type": "application/x-www-form-urlencoded",
    "useQueryString": true
});

req.form({});

req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(res.body);
});