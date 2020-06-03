const fs = require('fs')
const r = require("./snoowrapSetup.js")
const { writeFile } = require("./../writeFile")



async function getTopPosts(subreddit, time, limit) {
    const content = await r.getTop(subreddit, { time: time, limit: limit })
    return content

    // const filteredContent = await extractPostContent(content)
    // return filteredContent
}

const extractPostContent = (input) => {
    var clonedInput = JSON.parse(JSON.stringify(input))
    var keys = []
    var key = ""

    var splitPosts = {}
    for (i = 0; i < clonedInput.length; i++) {

        var post = JSON.parse(JSON.stringify(clonedInput[i]))
        post["selftext"] = post["selftext"].replace(/[^\x00-\x7F]/g, "").replace(/&#8203;|&#8203|&#x200B/gi,
            () => { return "" })
        post["title"] = post["title"].replace(/[^\x00-\x7F]/g, "").replace(/&#8203;|&#8203|&#x200B/gi,
            () => { return "" })
        var body = post["selftext"]
        var title = post["title"]
        // console.log(title)
        // console.log(title)
        // console.log(body)
        var newline = "\n\n"
        body = title.concat(newline, body)
        // console.log("title: ", title)
        // console.log("body: ", body)
        var postSegments = []
        key = "post" + i

        keys.push(key)

        if (body.length > 5000) {
            var remainingLength = body.length
            var currentStart = 0
            var currentEnd = 4999

            while (remainingLength > 5000) {
                if (body[currentEnd - 1] != ".") {
                    for (j = currentEnd - 1; j > currentStart; j--) {
                        if (body[j] == ".") {
                            currentEnd = j + 1
                            break;
                        }
                    }
                }

                postSegments.push(body.substring(currentStart, currentEnd))
                currentStart = currentEnd
                currentEnd = currentStart + 4999
                remainingLength = body.length - currentStart

            }
            if (remainingLength > 0) {
                postSegments.push(body.substring(currentStart, body.length))
            }

        } else if (body.length < 5000) {

            postSegments.push(body)
        }

        splitPosts[key] = postSegments
    }

    splitPosts["keys"] = keys
    return JSON.stringify(splitPosts)

}

async function getTopComments(subreddit, time) {
    const content = await r.getTop(subreddit, { time: time, limit: 1 })
    var response = await content[0].comments.fetchMore({ sort: 'top', skipReplies: "true", amount: 20 })
    // console.log(result)
    response = JSON.parse(JSON.stringify(response))
    // console.log(response[0])
    var extractedComments = extractComments(response)
    writeFile(JSON.stringify(extractedComments), "./../../json/topCommentsExtracted.json")

}

const extractComments = (response) => {

    var extractedComments = {}
    var keys = []
    for (i = 0; i < response.length; i++) {
        key = "comment" + i
        keys.push(key)
        extractedComments[key] = {
            "text": response[i]["body"],
            "upvotes": response[i]["ups"]
        }
        // console.log(response[i]["body"])
    }
    extractedComments["keys"] = keys

    return extractedComments
}

const cleanseString = (string) => {
    result = JSON.stringify(string).replace(/[^\x00-\x7F]/g, "")
    return string
}

module.exports = {
    extractPostContent,
    getTopComments,
    getTopPosts,
    cleanseString
}