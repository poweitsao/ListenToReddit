var fs = require('fs');

const combineAudio = (directory) => {
    var files = fs.readdirSync(directory);
    files = files.join(' ')

    console.log(files)

    var exec = require('child_process').exec;
    exec(`cd ../tests/audio; cat ${files} > podcast.mp3`,
        function (error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

}

module.exports