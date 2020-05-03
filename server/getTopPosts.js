// const snoowrap = require('snoowrap');
const fs = require('fs')
const r = require("./app.js")
const contentTest = require("./contentTest.json")

// r.getHot().map(post => post.title).then(console.log);

async function getTopPosts(subreddit, time, limit) {
    const content = await r.getTop(subreddit, { time: time })
    const filteredContent = await extractContent(content)
    return filteredContent
}


const extractContent = (input) => {
    var clonedInput = JSON.parse(JSON.stringify(input))
    var keys = []
    var key = ""

    var splitPosts = {}
    console.log(clonedInput.length)
    for (i = 0; i < clonedInput.length; i++) {
        console.log(i)
        console.log(clonedInput.length)

        var post = clonedInput[i]

        var body = JSON.stringify(post["selftext"])
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
                        if (body[j] != ".") {
                            currentEnd = j + 1
                            console.log("break")
                            break;
                        }
                    }
                }
                console.log("while")

                postSegments.push(body.substring(currentStart, currentEnd))
                currentStart = currentEnd
                currentEnd = currentStart + 4999
                remainingLength = body.length - currentStart

            }
            if (remainingLength > 0) {
                postSegments.push(body.substring(currentStart, body.length))
                console.log("push")
                console.log(i)
            }

        } else if (body.length < 5000) {

            postSegments.push(body)
        }

        splitPosts[key] = postSegments
    }

    splitPosts["keys"] = keys
    console.log(splitPosts["keys"])
    return splitPosts

}

const writeFile = (input, filename) => {
    fs.writeFile(filename, input, function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    })
}

getTopPosts("tifu", "day", 11).then((result) => {
    var stringifiedResult = JSON.stringify(result)
    writeFile(stringifiedResult, "response2.json")
})






