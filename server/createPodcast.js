const readline = require("readline");
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
const { writeFile } = require("./writeFile")
const textToSpeech = require("./google-api/textToSpeech")

const redditAPI = require("./reddit-api/redditAPI")
const directory = "../audio/createPlayground"
const audioLocation = "../audio/createPlayground/assets"
// var execSync = require('exec-sync');
const uploadPodcast = require("./uploadPodcast")


rl.question("\nWhat subreddit do you want to create a podcast for? \n", (subreddit) => {
    rl.question("\nDo you want the default option podcast configuration? (yes/no) ", (defaultConfig) => {
        rl.question("\nWould you like to automatically upload the new podcast to Cloud DataStore? (yes/no)", (upload) => {

            let newFilename = createPodcastFilename(subreddit)
            if (defaultConfig == "yes") {
                redditAPI.getTopPosts(subreddit, "daily", 5).then((result) => {
                    var processedResult = redditAPI.extractPostContent(result)
                    writeFile(processedResult, directory + "/posts.json").then(async () => {

                        const posts = JSON.parse(processedResult)

                        key = posts["keys"][0]
                        for (postNumber = 0; postNumber < posts["keys"].length; postNumber++) {
                            key = posts["keys"][postNumber]
                            await textToSpeech.JSONToMP3(posts[key], "en-US", "MALE", "en-US-Wavenet-B", audioLocation, key + ".mp3")
                        }
                        combineAudio(newFilename, audioLocation).then(async () => {
                            if (upload == "yes") {
                                await uploadPodcast.autoUpload(newFilename)
                                rl.close()

                            } else {
                                console.log("\nAuto-upload canceled")
                                rl.close()

                            }
                        })

                        // return
                    })
                })



            } else {
                customPodcast(subreddit);
                combineAudio(newFilename, audioLocation)
            }

        })

    })


})

const createPodcastFilename = (subreddit) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var newFilename = subreddit + "-" + yyyy + "-" + mm + '-' + dd + ".mp3";
    return newFilename
}

const customPodcast = (subreddit) => {

    rl.question("\nWhat category of top posts do you want? (daily, monthly or annually) ", (category) => {
        console.log(`\nYou've created a podcast for r/${subreddit} consisting of the top ${category} posts.`);
        rl.close();

    })

}

async function combineAudio(newFilename, directory) {
    return new Promise((resolve) => {
        var files = fs.readdirSync(directory);

        files = files.join(' ')

        var exec = require('child_process').exec;

        exec(`cd ${directory}; cat ${files} > ${newFilename}`,
            function (error, stdout, stderr) {

                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }

                if (fs.existsSync(directory + "/" + newFilename)) {
                    console.log("Successfully combined files: " + newFilename + " created")

                } else {
                    console.log("%c Something went wrong. " + newFilename + " not found in directory", 'color: #FF0000')
                }

            }).on("exit", () => {
                exec(`cd ${directory}; mv ${newFilename} ..;`,
                    function (error, stdout, stderr) {
                        console.log(stdout)
                        console.log(newFilename + " moved out of assets folder")

                    }).on("exit", function () {
                        var assetsFolder = directory.split("/")
                        assetsFolder = assetsFolder[assetsFolder.length - 1]
                        exec(`cd ${directory}; cd ..; rm ${assetsFolder + "/*"}`,
                            function (error, stdout, stderr) {
                                console.log(stdout)
                                console.log("Removed temporary assets")

                            })
                    }).on("exit", function () {
                        resolve(true);

                    })



            })

    })






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

// create()