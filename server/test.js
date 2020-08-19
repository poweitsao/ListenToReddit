const redditAPI = require("./reddit-api/redditAPI")
const { writeFile } = require("./writeFile")
const { getIndividualPodcasts } = require("./getIndividualPodcasts")
const getMP3Duration = require('get-mp3-duration')
const fs = require('fs');
const moment = require('moment')

const { autoUploadIndividualPodcasts } = require("./uploadPodcast");
const { arch } = require("os");

const audioLocation = "../audio/createPlayground/assets"


function formatDuration(duration) {
    return moment
        .duration(duration, "seconds")
        .format("mm:ss", { trim: false });
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
        key = title

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

function archiveAudioFiles(directory) {
    var exec = require('child_process').exec;
    exec(`cd ${directory}; mv *.mp3 ../archive`,
        function (error, stdout, stderr) {

            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.error('exec error: ' + error);
            }

            if (fs.readdirSync(directory).length === 0) {
                console.log('\x1b[36m%s\x1b[0m', "Successfully archived files.")

            } else {
                console.error("%c Something went wrong. Files still found in directory")
            }

        })
}

const test = async () => {
    // redditAPI.getTopPosts("tifu", "daily", 2).then((result) => {
    //     // var processedResult = redditAPI.extractPostContent(result)
    //     var processedResult = redditAPI.extractPostContent(result)
    //     writeFile(processedResult, "./test.json")

    // })
    // const audioLocation = "../audio/createPlayground/assets"
    // var files = getIndividualPodcasts(audioLocation)

    // autoUploadIndividualPodcasts(files, "Showerthoughts", audioLocation)
    // var files = getIndividualPodcasts(audioLocation)
    // console.log(files)
    // const buffer = fs.readFileSync(audioLocation + "/" + files[2])

    // const duration = getMP3Duration(buffer)
    // console.log("duration", duration)

    // archiveAudioFiles(audioLocation)
    console.log('\x1b[36m%s\x1b[0m', "Test")




}

test()