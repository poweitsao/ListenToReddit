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
    const client = new textToSpeech.TextToSpeechClient();
    // console.log(filename)
    // Construct the request
    const request = {
        input: { text: text["content"][0] },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: languageCode, ssmlGender: ssmlGender, name: voiceName },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    filename = filename.replace("/", " or ")

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(directory + "/" + filename, response.audioContent, 'binary');
    // await writeFile('response1-wav.txt', response, 'binary');
    // console.log(response)
    console.log('Audio content written to file: ' + filename + " in " + directory);
    return directory
}

module.exports = {
    JSONToMP3
}