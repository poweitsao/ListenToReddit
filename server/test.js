const redditAPI = require("./reddit-api/redditAPI")
const r = require("./reddit-api/snoowrapSetup.js")

const { writeFile } = require("./writeFile")
const { getIndividualPodcasts } = require("./getIndividualPodcasts")
const getMP3Duration = require('get-mp3-duration')
const fs = require('fs');
const moment = require('moment')

const { autoUploadIndividualPodcasts } = require("./uploadPodcast");
const { arch } = require("os");

const audioLocation = "../audio/createPlayground/assets"
const getUrls = require('get-urls');
const { extractPostContent } = require("./reddit-api/redditAPI")



// function formatDuration(duration) {
//     return moment
//         .duration(duration, "seconds")
//         .format("mm:ss", { trim: false });
// }

// const extractPostContent = (input) => {
//     var clonedInput = JSON.parse(JSON.stringify(input))
//     var keys = []
//     var key = ""
//     var splitPosts = {}
//     for (i = 0; i < clonedInput.length; i++) {

//         var post = JSON.parse(JSON.stringify(clonedInput[i]))
//         post["selftext"] = post["selftext"].replace(/[^\x00-\x7F]/g, "").replace(/&#8203;|&#8203|&#x200B/gi,
//             () => { return "" })
//         post["title"] = post["title"].replace(/[^\x00-\x7F]/g, "").replace(/&#8203;|&#8203|&#x200B/gi,
//             () => { return "" })
//         var body = post["selftext"]
//         var title = post["title"]
//         // console.log(title)
//         // console.log(title)
//         // console.log(body)
//         var newline = "\n\n"
//         body = title.concat(newline, body)
//         // console.log("title: ", title)
//         // console.log("body: ", body)
//         var postSegments = []
//         key = title

//         keys.push(key)

//         if (body.length > 5000) {
//             var remainingLength = body.length
//             var currentStart = 0
//             var currentEnd = 4999

//             while (remainingLength > 5000) {
//                 if (body[currentEnd - 1] != ".") {
//                     for (j = currentEnd - 1; j > currentStart; j--) {
//                         if (body[j] == ".") {
//                             currentEnd = j + 1
//                             break;
//                         }
//                     }
//                 }

//                 postSegments.push(body.substring(currentStart, currentEnd))
//                 currentStart = currentEnd
//                 currentEnd = currentStart + 4999
//                 remainingLength = body.length - currentStart

//             }
//             if (remainingLength > 0) {
//                 postSegments.push(body.substring(currentStart, body.length))
//             }

//         } else if (body.length < 5000) {

//             postSegments.push(body)
//         }

//         splitPosts[key] = postSegments
//     }

//     splitPosts["keys"] = keys
//     return JSON.stringify(splitPosts)

// }

// function archiveAudioFiles(directory) {
//     var exec = require('child_process').exec;
//     exec(`cd ${directory}; mv *.mp3 ../archive`,
//         function (error, stdout, stderr) {

//             console.log(stdout);
//             console.log(stderr);
//             if (error !== null) {
//                 console.error('exec error: ' + error);
//             }

//             if (fs.readdirSync(directory).length === 0) {
//                 console.log('\x1b[36m%s\x1b[0m', "Successfully archived files.")

//             } else {
//                 console.error("%c Something went wrong. Files still found in directory")
//             }

//         })
// }

const test = async () => {
    // const post = await r.getTop("WritingPrompts", { time: "daily", limit: 1 })
    const posts = await redditAPI.getTopPosts("WritingPrompts", "daily", 1)
    console.log(redditAPI.extractPostContent(posts))
    // var text = "https://www.reddit.com/r/mildlyinteresting/comments/ilfsl7/_/"
    // console.log(getUrls(text, { requireSchemeOrWww: true, normalizeProtocol: false, stripWWW: false }))

    // for (var j = 0; j < posts.length; j++) {
    //     console.log("post:", posts[j]["title"])
    //     var response = await posts[j].comments.fetchMore({ sort: 'top', skipReplies: "true", amount: 2 })
    //     for (var i = 0; i < response.length; i++) {
    //         if ((await response[i]).author.name !== "AutoModerator") {
    //             console.log("comment:", response[i].body)
    //         }
    //     }
    // }
    // redditAPI.extractPostContent(posts)
    // redditAPI.extractPostContent(posts)


    // var stuff = await redditAPI.getTopComments("WritingPrompts", "daily")
    // console.log(stuff)

    // redditAPI.getTopPosts("WritingPrompts", "daily", 1).then((result) => {
    //     // var processedResult = redditAPI.extractPostContent(result)
    //     // writeFile(processedResult, "./test.json")
    //     // console.log(JSON.parse(JSON.stringify(result.comments.fetchMore({ sort: 'top', skipReplies: "true", amount: 1 }))))
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
    // console.log('\x1b[36m%s\x1b[0m', "Test")




}

test()