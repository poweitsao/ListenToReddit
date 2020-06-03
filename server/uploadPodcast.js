const cloudStorage = require("./google-api/cloudStorage")
const database = require("./google-api/database")
let filename = "hiJuJu.mp3"
const readline = require("readline");
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



rl.question("\nWhich podcast do you want to upload? ", async (filename) => {

    var fileInfo = filename.split("-")
    var subreddit = fileInfo[0]
    await cloudStorage.uploadFile("listen-to-reddit-test", "../audio/" + filename)
    await cloudStorage.moveFile("listen-to-reddit-test", "" + filename, "podcasts/" + filename)
    database.addPodcastToDB(subreddit, filename, cloudStorage.getFileURL("listen-to-reddit-test", "podcasts", filename))
    rl.close()
})


