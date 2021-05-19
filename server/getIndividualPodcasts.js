var fs = require('fs');

const getIndividualPodcasts = (directory) => {
    console.log("reading podcasts", directory)
    var files = fs.readdirSync(directory);
    files = files.filter(item => item != "tempCombine")
    console.log(files)
    // files = files.join(' ')

    // console.log(files)
    return files

    // var exec = require('child_process').exec;
    // exec(`cd ../tests/audio; cat ${files} > podcast.mp3`,
    //     function (error, stdout, stderr) {
    //         console.log(stdout);
    //         console.log(stderr);
    //         if (error !== null) {
    //             console.log('exec error: ' + error);
    //         }
    //     });

}


module.exports = {
    getIndividualPodcasts
}