const fs = require('fs')
const util = require('util');

async function writeFile(input, filename) {
    const writeFile = util.promisify(fs.writeFile);
    try {
        await writeFile(filename, input);
    } catch (e) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    } finally {
        console.log("JSON file '" + filename + "' has been saved.");
    }
}

module.exports = {

    writeFile

}