// runs processes via function calls.

// const { getTopPosts, getTopPostsTest } = require("./reddit-api/redditAPI")
// const { extractPostContent } = require("./reddit-api/extractPostContent")
// const { writeFile } = require("./writeFile")
// const { JSONToMP3 } = require("./google-api/textToSpeech")
// const { cleanseString } = require("./reddit-api/cleanseString")

// console.log(cloudStorage.getFileURL("listen-to-reddit-test", "podcasts", "juju2.mp3"))
// cloudStorage.getMetadata("listen-to-reddit-test", "podcasts", "juju2.mp3")

// cloudStorage.setEncoding("listen-to-reddit-test", "podcasts", "indianVoice.mp3")

// const response2 = require("./../json/response2.json")

// var directory = "/Users/poweitsao/Desktop/ListenReddit/tests"
// getTopPosts("jokes", "day", 5).then((result) => {
//     // var stringifiedResult = JSON.stringify(result)
//     var processedResult = extractPostContent(result)
//     writeFile(processedResult, directory + "/posts.json").then(() => {
//         const posts = JSON.parse(processedResult)
//         // console.log(posts["keys"])

//         key = posts["keys"][0]
//         // JSONToMP3(posts[key], "en-US", "MALE", "en-US-Standard-E", directory + "/audio", key + ".mp3")
//         // JSONToMP3(posts[key], "en-US", "MALE", "en-US-Standard-E", directory + "/audio", key + ".mp3")

//         for (postNumber = 0; postNumber < posts["keys"].length; postNumber++) {
//             key = posts["keys"][postNumber]
//             JSONToMP3(posts[key], "en-US", "MALE", "en-US-Wavenet-B", directory + "/audio", key + ".mp3")
//             // console.log("converting " + key + " to mp3 in " + directory + "/audio")
//         }
//     })
// })

// const a = require("./../tests/posts.json")
// key = "post2"
// var string = cleanseString(a["post2"][0])
// // console.log(string)
// // console.log(string)
// // console.log(array)
// JSONToMP3(string, "en-US", "MALE", "en-US-Standard-E", directory + "/audio", key + ".mp3")


// getTopPostsTest().then((content) => {
//     console.log(content)
// })

// const postContent = response2["post18"]
// for (i = 0; i < postContent.length; i++) {
//     var filename = "post1-" + i + ".mp3"
//     JSONToMP3(postContent[i], "en-US", "MALE", "en-US-Wavenet-A", filename)
// }
