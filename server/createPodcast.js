const readline = require("readline");
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const { writeFile } = require("./writeFile")
const textToSpeech = require("./google-api/textToSpeech")

const redditAPI = require("./reddit-api/redditAPI")
const directory = "../tests"
const audioLocation = "../tests/scriptTest"
rl.question("\nWhat subreddit do you want to create a podcast for? ", (subreddit) => {
    rl.question("\nDo you want the default option podcast configuration? (yes/no) ", (defaultConfig) => {
        if (defaultConfig == "yes") {
            redditAPI.getTopPosts(subreddit, "daily", 5).then((result) => {
                var processedResult = redditAPI.extractPostContent(result)
                writeFile(processedResult, directory + "/posts.json").then(() => {

                    const posts = JSON.parse(processedResult)

                    key = posts["keys"][0]
                    for (postNumber = 0; postNumber < posts["keys"].length; postNumber++) {
                        key = posts["keys"][postNumber]
                        textToSpeech.JSONToMP3(posts[key], "en-US", "MALE", "en-US-Wavenet-B", audioLocation, key + ".mp3")

                    }
                })
            })

        } else {
            customPodcast(subreddit);
        }

        combineAudio(audioLocation)
        rl.close();

    })


})

const customPodcast = (subreddit) => {

    rl.question("\nWhat category of top posts do you want? (daily, monthly or annually) ", (category) => {
        console.log(`\nYou've created a podcast for r/${subreddit} consisting of the top ${category} posts.`);
        rl.close();

    })

}

const combineAudio = (directory) => {
    var files = fs.readdirSync(directory);
    files = files.join(' ')

    // console.log(files)

    var exec = require('child_process').exec;
    exec(`cd ${directory}; cat ${files} > podcast.mp3`,
        function (error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }

            if (fs.existsSync(directory + "/podcast.mp3")) {
                console.log("Successfully combined files: podcast.mp3 created")
            } else {
                console.log("%c Something went wrong. podcast.mp3 not found in directory", 'color: #FF0000')
            }
        });

}

// rl.question("What is your name ? ", function (name) {
//     rl.question("Where do you live ? ", function (country) {
//         console.log(`${name}, is a citizen of ${country}`);
//         rl.close();
//     });
// });

// rl.on("close", function () {
//     console.log("\nBYE BYE !!!");
//     process.exit(0);
// });