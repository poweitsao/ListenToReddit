const fs = require('fs')

const writeFile = (input, filename) => {
    fs.writeFile(filename, input, function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file '" + filename + "' has been saved.");
    })
}

module.exports = {

    writeFile

}