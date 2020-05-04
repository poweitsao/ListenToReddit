const fs = require('fs')
const r = require("./snoowrapSetup.js")


async function getTopPosts(subreddit, time, limit) {
    const content = await r.getTop(subreddit, { time: time })
    const filteredContent = await extractContent(content)
    return filteredContent
}

async function getTopPostsTest() {
    const contentTest = require("./../json/contentTest.json")
    const filteredContent = await extractContent(contentTest)
    // console.log(filteredContent)
}


const extractContent = (input) => {
    var clonedInput = JSON.parse(JSON.stringify(input))
    var keys = []
    var key = ""

    var splitPosts = {}
    for (i = 0; i < clonedInput.length; i++) {

        var post = clonedInput[i]

        var body = post["selftext"]
        var title = post["title"]
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
    return splitPosts

}

const writeFile = (input, filename) => {
    fs.writeFile(filename, input, function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file '" + filename + "' has been saved.");
    })
}

module.exports = {
    writeFile,
    getTopPosts,
    getTopPostsTest
}




