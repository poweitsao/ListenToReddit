const r = require("./snoowrapSetup.js")
const { writeFile } = require("./../writeFile")
const { extractComments } = require("./extractComments")

async function getTopComments(subreddit, time) {
    const content = await r.getTop(subreddit, { time: time, limit: 1 })
    var response = await content[0].comments.fetchMore({ sort: 'top', skipReplies: "true", amount: 20 })
    // console.log(result)
    response = JSON.parse(JSON.stringify(response))
    // console.log(response[0])
    var extractedComments = extractComments(response)
    writeFile(JSON.stringify(extractedComments), "./../../json/topCommentsExtracted.json")

}

getTopComments("tifu", "daily")