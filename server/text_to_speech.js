// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
async function quickStart() {
    // The text to synthesize
    var response1 = require("./response1.json")
    const text = response1[0]["selftext"]

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL', name: "en-US-Wavenet-F" },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('response1-wav.mp3', response.audioContent, 'binary');
    await writeFile('response1-wav.txt', response, 'binary');
    console.log(response)
    console.log('Audio content written to file: output.mp3');
}
quickStart();