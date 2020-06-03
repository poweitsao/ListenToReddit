const cloudStorage = require("./google-api/cloudStorage")
const database = require("./google-api/database")
// let filename = "hiJuJu.mp3"
const readline = require("readline");
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const playgroundDirectory = "../audio/createPlayground/"

// const exec = require('child_process').exec;

var files = fs.readdirSync(playgroundDirectory);
files.splice(files.indexOf("assets"), 1)
files = files.join(", ")



rl.question(`\nWhich podcast do you want to upload? \nOptions: (${files})`, async (filename) => {

    var fileInfo = filename.split("-")
    var subreddit = fileInfo[0]
    await cloudStorage.uploadFile("listen-to-reddit-test", playgroundDirectory + filename)
    await cloudStorage.moveFile("listen-to-reddit-test", "" + filename, "podcasts/" + filename)
    database.addPodcastToDB(subreddit, filename, cloudStorage.getFileURL("listen-to-reddit-test", "podcasts", filename))
    rl.close()
})


