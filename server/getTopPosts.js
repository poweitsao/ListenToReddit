// const snoowrap = require('snoowrap');
const fs = require('fs')

// const r = new snoowrap({
//     userAgent: 'my-user-agent',
//     clientId: '8HEEi0-ABoTZpg',
//     clientSecret: 'j3Pzu1RVKOePHMs6fIT3DPSv1II',
//     refreshToken: '5892126037-OKFJOkL8TW-LitxWZofkzV7ygc0'
//     //accessToken: '5892126037-_7CBUE96vl5QhxE4Jy7eX84urW4'
// });

const r = require("./app.js")

// r.getHot().map(post => post.title).then(console.log);

async function getTopPosts(subreddit, time, limit) {
    const content = await r.getTop(subreddit, { time: time, limit: limit })
    const filteredContent = await extractContent(content)
    return filteredContent
}


const extractContent = (input) => {
    var clonedInput = JSON.parse(JSON.stringify(input))
    // var jsonContent = JSON.stringify(input)
    var posts = []

    for (i = 0; i < clonedInput.length; i++) {
        var post = clonedInput[i]
        var content = {}
        content["selftext"] = post["selftext"]
        content["title"] = post["title"]
        content["id"] = post["id"]
        // console.log(content)
        posts.push(content)
    }
    return posts

}
async function run() {

    var result = await getTopPosts("tifu", "day", 2)
    var stringifiedResult = JSON.stringify(result)
    // console.log(stringifiedResult[0]["title"])
    fs.writeFile("response1.json", stringifiedResult, function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    })

}

run()