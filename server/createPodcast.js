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
const uploadPodcast = require("./uploadPodcast");
const { getIndividualPodcasts } = require("./getIndividualPodcasts");


rl.question("\nWhat subreddit do you want to create a podcast for? \n", (subreddit) => {
    // console.log(subreddit)
    rl.question("\nHow many posts do you want to get? ", (numOfPosts) => {
        numOfPosts = parseInt(numOfPosts)
        rl.question("\nDo you want the default option podcast configuration? (yes/no) ", (defaultConfig) => {
            rl.question("\nDo you want to combine the posts into one podcast? (yes/no) ", (combine) => {
                rl.question("\nHow many comments do you want to include? ", (numOfComments) => {
                    numOfComments = parseInt(numOfComments)
                    rl.question("\nWould you like to automatically upload the new podcast to Cloud DataStore? (yes/no)", (upload) => {

                        if (defaultConfig == "yes") {
                            redditAPI.getTopPosts(subreddit, "all", numOfPosts).then((result) => {
                                // console.log(result)
                                redditAPI.extractPostContent(result,
                                    {
                                        includeComments: (numOfComments > 0),
                                        numberOfComments: numOfComments
                                    }).then((processedResult) => {
                                        writeFile(processedResult, directory + "/posts.json").then(async () => {

                                            // await convertPostToPodcast(processedResult)

                                            if (combine == "yes") {
                                                let newFilename = createPodcastFilename(subreddit)
                                                await convertPostToCombinedPodcast(processedResult)
                                                combineAudio(newFilename, audioLocation).then(async () => {
                                                    if (upload == "yes") {
                                                        await uploadPodcast.autoUploadCombinedPodcast(newFilename, subreddit)
                                                        rl.close()

                                                    } else {
                                                        console.log("\nAuto-upload canceled")
                                                        rl.close()

                                                    }
                                                })
                                            } else {
                                                var filenameToPostTitle = await convertPostsToPodcasts(processedResult)
                                                console.log(JSON.stringify(filenameToPostTitle))
                                                if (upload == "yes") {
                                                    var files = getIndividualPodcasts(audioLocation)

                                                    await uploadPodcast.autoUploadIndividualPodcasts(files, subreddit, audioLocation, filenameToPostTitle)
                                                    archiveAudioFiles(audioLocation)
                                                    rl.close()

                                                } else {
                                                    console.log("\nAuto-upload canceled")
                                                    rl.close()

                                                }
                                            }


                                            // return
                                        })
                                    })


                            })



                        } else {
                            customPodcast(subreddit);
                            combineAudio(newFilename, audioLocation)
                        }
                    })
                })
            })
        })

    })


})

const convertPostToCombinedPodcast = async (file) => {
    const posts = JSON.parse(file)

    key = posts["keys"][0]
    for (postNumber = 0; postNumber < posts["keys"].length; postNumber++) {
        key = posts["keys"][postNumber]
        await textToSpeech.JSONToMP3(posts[key], "en-US", "MALE", "en-US-Wavenet-B", audioLocation, "post-" + postNumber.toString() + ".mp3")
    }
}

function processFilename(filename) {
    // <>*?":/\| and blank space at the end
    // filename = filename.replace(/\//g, " or ")
    // filename = filename.replace(/</g, "")
    // filename = filename.replace(/>/g, "")
    // filename = filename.replace(/\*/g, "")
    // filename = filename.replace(/\?/g, "")
    // filename = filename.replace(/\"/g, "'")
    // filename = filename.replace(/\:/g, ",")
    // filename = filename.replace(/\|/g, "")
    // filename = filename.replace("\\", "");



    if (filename.length > 250) {
        for (var i = 250; filename[i] !== " "; i--) {
        }
        return filename.substring(0, i) + "..."
    } else {
        return filename
    }
}

const convertPostsToPodcasts = async (file) => {
    const posts = JSON.parse(file)
    // console.log(posts)
    var filenameToPostTitle = {}
    key = posts["keys"][0]
    for (postNumber = 0; postNumber < posts["keys"].length; postNumber++) {
        // console.log(key)
        key = posts["keys"][postNumber]
        var filename = processFilename(key)
        var filename = generateID(20) + ".mp3"
        // console.log(filename)
        var comments = posts[key]["comments"]
        // console.log("comments", comments)
        var text = JSON.parse(JSON.stringify(posts[key]))
        // console.log(comments)
        if (comments.length > 0) {
            text["content"] = text["content"] + ". These are the top comments of this post."

            for (var i = 0; i < comments.length; i++) {
                text["content"] = "\n" + text["content"] + "." + "Comment number " + (i + 1).toString() + ".";
                text["content"] = text["content"] + "\n" + comments[i];
            }
        }

        // console.log(text)
        try {
            await textToSpeech.JSONToMP3(text, "en-US", "MALE", "en-US-Wavenet-B", audioLocation, filename)
            filenameToPostTitle[filename] = processFilename(key)
        } catch (e) {
            console.error(e)
        }
    }
    return filenameToPostTitle
}

function generateID(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

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

function archiveAudioFiles(directory) {
    var exec = require('child_process').exec;
    exec(`mv *.mp3 ../archive`, { cwd: directory },
        function (error, stdout, stderr) {

            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.error('exec error: ' + error);
            }

            if (fs.readdirSync(directory).length == 1) {
                console.info('\x1b[36m%s\x1b[0m', "Successfully archived files.")

            } else {
                console.error("%c Something went wrong. Files still found in directory")
                console.log(fs.readdirSync(directory))
            }

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