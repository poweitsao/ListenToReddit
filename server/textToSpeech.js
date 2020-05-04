// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
async function JSONToMP3(text, languageCode, ssmlGender, voiceName, filename) {
    // The text to synthesize
    // var response1 = require("./response1.json")
    const client = new textToSpeech.TextToSpeechClient();

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: languageCode, ssmlGender: ssmlGender, name: voiceName },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    filename = "../audio/" + filename
    await writeFile(filename, response.audioContent, 'binary');
    // await writeFile('response1-wav.txt', response, 'binary');
    // console.log(response)
    console.log('Audio content written to file: ' + filename);
}

module.exports = {
    JSONToMP3
}