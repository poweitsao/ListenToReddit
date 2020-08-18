const cloudStorage = require("./google-api/cloudStorage")
const database = require("./google-api/database")
// let filename = "hiJuJu.mp3"
const readline = require("readline");
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const getMP3Duration = require('get-mp3-duration')

const playgroundDirectory = "../audio/createPlayground/"

// const exec = require('child_process').exec;

const manualUpload = async (subreddit) => {
    var files = fs.readdirSync(playgroundDirectory);
    files.splice(files.indexOf("assets"), 1)
    files = files.join(", ")



    rl.question(`\nWhich podcast do you want to upload? \nOptions: (${files})`, async (filename) => {

        // var fileInfo = filename.split("-")
        // var subreddit = fileInfo[0]
        await cloudStorage.uploadFile("listen-to-reddit-test", playgroundDirectory + filename)
        await cloudStorage.moveFile("listen-to-reddit-test", "" + filename, "subreddits/" + subreddit + "/" + filename)
        database.addPodcastToDB(subreddit, filename, cloudStorage.getFileURL("listen-to-reddit-test", "subreddits/" + subreddit, filename))
        rl.close()
    })
}

const autoUploadCombinedPodcast = async (filename, subreddit) => {
    // let splitFilename = filename.split("-")
    // let subreddit = splitFilename[0]

    await cloudStorage.uploadFile("listen-to-reddit-test", playgroundDirectory + filename)
    await cloudStorage.moveFile("listen-to-reddit-test", "" + filename, "subreddits/" + subreddit + "/" + filename)
    database.addPodcastToDB(subreddit, filename, cloudStorage.getFileURL("listen-to-reddit-test", "subreddits/" + subreddit, filename))
    console.log("\nAuto-upload complete!")
}

const getPodcastDuration = (audioLocation, file) => {
    var buffer = fs.readFileSync(audioLocation + "/" + file)
    var duration = getMP3Duration(buffer) / 1000
    duration = Math.round(duration)
    return duration
}

const autoUploadIndividualPodcasts = async (files, subreddit, audioLocation) => {
    var duration = 0
    for (fileItr = 0; fileItr < files.length; fileItr++) {
        var filename = files[fileItr]
        duration = getPodcastDuration(audioLocation, filename)

        //console.log("duration", duration)

        await cloudStorage.uploadFile("listen-to-reddit-test", audioLocation + "/" + filename)
        await cloudStorage.moveFile("listen-to-reddit-test", "" + filename, "subreddits/" + subreddit + "/" + filename)
        database.addPodcastToDB(subreddit, filename, cloudStorage.getFileURL("listen-to-reddit-test", "subreddits/" + subreddit, filename), duration)
    }

    console.log("\nAuto-upload complete!")
}


module.exports = {
    manualUpload, autoUploadCombinedPodcast, autoUploadIndividualPodcasts
}

