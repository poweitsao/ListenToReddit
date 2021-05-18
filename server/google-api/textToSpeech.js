// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
async function JSONToMP3(text, languageCode, ssmlGender, voiceName, directory, filename) {
    // console.log("text", text)
    // The text to synthesize
    // var response1 = require("./response1.json")
    var client = new textToSpeech.TextToSpeechClient();
    // console.log(filename)
    // Construct the request
    var postSegments = breakUpBody(text["content"])
    // console.log(postSegments.length)
    // for (var i = 0; i < postSegments.length; i++){
    //     console.log("postSegment", postSegments[i].toString())
    //     console.log("postSegment Length", postSegments[i].length)
    // }
    // return
    console.log("JSON to mp3 running...", 1)
    if(postSegments.length == 1){
        const request = {
            input: { text: postSegments[0] },
            // Select the language and SSML voice gender (optional)
            voice: { languageCode: languageCode, ssmlGender: ssmlGender, name: voiceName },
            // select the type of audio encoding
            audioConfig: { audioEncoding: 'MP3' },
        };

        filename = filename.replace("/", " or ")

        // Performs the text-to-speech request
        try{
            var [response] = await client.synthesizeSpeech(request);
        }
        catch (e){
            console.error("error in JSON to MP3",e);
        }        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(directory + "/" + filename, response.audioContent, 'binary');


    } else{
        filename = filename.replace("/", " or ")
        const writeFile = util.promisify(fs.writeFile);
        for (var i = 0; i < postSegments.length; i++){
            var client = new textToSpeech.TextToSpeechClient();
            
            var request = {
                input: { text: postSegments[i] },
                // Select the language and SSML voice gender (optional)
                voice: { languageCode: languageCode, ssmlGender: ssmlGender, name: voiceName },
                // select the type of audio encoding
                audioConfig: { audioEncoding: 'MP3' },
            };
    
            // Performs the text-to-speech request
            console.log("sending text-to-speech request", i)
            try{
                var [response] = await client.synthesizeSpeech(request);

            }
            catch (e){
                console.error("error in JSON to MP3")
                console.error(e);
            }
            // Write the binary audio content to a local file
            
            await writeFile(directory + "/tempCombine/" + i.toString()+".mp3", response.audioContent, 'binary');
        }
        await combineAudio(filename, "../audio/createPlayground/assets/tempCombine")
    }
    
    // await writeFile('response1-wav.txt', response, 'binary');
    // console.log(response)
    console.log('Audio content written to file: ' + filename + " in " + directory);
    return directory
}

async function combineAudio(newFilename, directory) {
    return new Promise((resolve) => {
        var files = fs.readdirSync(directory);
        
        files = files.join(' ')

        var exec = require('child_process').exec;

        // exec(`cd ${directory};`,

        // function (error, stdout, stderr) {

        //     console.log(stdout);
        //     console.log(stderr);
            

        // })
        // const path = require("path")
        
        // console.log(directory)

        // exec(`cd ${directory}; cat ${files} > ${newFilename}`,
        // exec("cd ..",
        exec(` cat ${files} > newcombined.mp3`, {cwd: directory},

            function (error, stdout, stderr) {

                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }

                if (fs.existsSync(directory + "/" + "newcombined.mp3")) {
                    console.log("Successfully combined files: " + newFilename + " created")

                } else {
                    console.log("%c Something went wrong. " + newFilename + " not found in directory", 'color: #FF0000')
                }

            }).on("exit", () => {
                // console.log(processedFilename)
                // console.log(directory)
                // exec(`mv newcombined.mp3 ../${processedFilename};`, {cwd: directory},
                exec(`mv newcombined.mp3 ../"${newFilename}"`, {cwd: directory},

                    function (error, stdout, stderr) {
                        console.log(stdout)
                        // console.log(newFilename + " moved out of assets folder")

                    }).on("exit", function () {
                        var assetsFolder = directory.split("/")
                        directory = assetsFolder.slice(0, assetsFolder.length - 1).join("/")
                        assetsFolder = assetsFolder[assetsFolder.length - 1]
                        console.log("directory", directory)
                        console.log("tempCombine", assetsFolder)
                        console.log(`rm ${assetsFolder + "/*"}`)
                        exec(`rm ${assetsFolder + "/*"}`, {cwd: directory},
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

const breakUpBody = (body) => {
    var postSegments = []

    if (body.length > 5000) {
        var remainingLength = body.length
        var currentStart = 0
        var currentEnd = 4999

        while (remainingLength > 5000) {
            if (body[currentEnd - 1] != ".") {
                for (j = currentEnd - 1; j > currentStart; j--) {
                    if (body[j] == "." |body[j] == "?"|body[j] == ","|body[j] == "!") {
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
    return postSegments
}

// combineAudio("YSK, Gasoline is not just extremely flammable and can create explosive mixtures with air, it is also very carcinogenic, toxic and a strong teratogen..mp3","../../audio/createPlayground/assets/tempCombine/")

module.exports = {
    JSONToMP3
}