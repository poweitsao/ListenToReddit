const fs = require('fs')
const r = require("./snoowrapSetup.js")
const { writeFile } = require("./../writeFile")
const getUrls = require('get-urls');




async function getTopPosts(subreddit, time, limit) {
    const content = await r.getTop(subreddit, { time: time, limit: limit })
    // console.log(content)
    return content

    // const filteredContent = await extractPostContent(content)
    // return filteredContent
}

const extractPostContent = async (input, options = { includeComments: false, numberOfComments: 0 }) => {
    var clonedInput = JSON.parse(JSON.stringify(input))
    var { includeComments, numberOfComments } = options
    var keys = []
    var key = ""
    var splitPosts = {}
    for (i = 0; i < clonedInput.length; i++) {

        var post = JSON.parse(JSON.stringify(clonedInput[i]))
        key = post["title"]
        keys.push(key)
        var postContent = extractPostTitleAndText(post)
        var comments = []
        if (includeComments) {
            comments = await extractPostComments(input[i], numberOfComments)
        }
        var postSegments = { "content": postContent, "comments": comments }
        splitPosts[key] = postSegments
    }

    splitPosts["keys"] = keys
    return JSON.stringify(splitPosts)

}

const extractPostTitleAndText = (post) => {
    post["selftext"] = post["selftext"].replace(/[^\x00-\x7F]/g, "").replace(/&#8203;|&#8203|&#x200B/gi,
        () => { return "" })
    post["title"] = post["title"].replace(/[^\x00-\x7F]/g, "").replace(/&#8203;|&#8203|&#x200B/gi,
        () => { return "" })

    var body = post["selftext"]
    var title = post["title"] + ","
    var newline = ".\n"
    body = title.concat(newline, body)

    body = body.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    body = body.replace(/\*/g, '');
    body = body.replace(/\"/g, "'");

    // console.log(body)
    // var postSegments = breakUpBody(body)
    return body
}

const breakUpBody = (body) => {
    var postSegments = []

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
    return postSegments
}

const extractPostComments = async (post, numberOfComments) => {
    var response = await post.comments.fetchMore({ sort: 'top', skipReplies: "true", amount: numberOfComments })
    var comments = []
    for (var i = 0; i < response.length; i++) {
        // console.log(response[i])
        if ((await response[i]).distinguished !== "moderator") {
            var body = (await response[i]["body"])
            // console.log("body:", body)
            // var urls = [...getUrls(post["selftext"], { stripWWW: false })]
            // for (var k = 0; k < urls.length; k++) {
            //     body = body.replace((urls[k]).toString(), "")
            // }
            body = body.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
            body = body.replace(/\*/g, '');
            comments.push(body)
        }
    }
    return comments

}

async function getTopComments(subreddit, time) {
    const content = await r.getTop(subreddit, { time: time, limit: 1 })
    var response = content[0].comments.fetchMore({ sort: 'top', skipReplies: "true", amount: 1 })
    // console.log(result)
    response = JSON.parse(JSON.stringify(response))
    // console.log(response[0])
    var extractedComments = extractComments(response)
    // writeFile(JSON.stringify(extractedComments), "./../../json/topCommentsExtracted.json")
    return JSON.stringify(extractedComments)

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
    extractPostComments,
    getTopComments,
    getTopPosts,
    cleanseString
}