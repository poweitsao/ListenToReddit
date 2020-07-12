const Firestore = require('@google-cloud/firestore');

var file = require("../../credentials/eternal-arcana-275612-78d4d7540a6a.json")


const db = new Firestore({
    projectId: 'eternal-arcana-275612',
    credentials: { client_email: file.client_email, private_key: file.private_key }
});

// const db = new Firestore({
//     projectId: 'eternal-arcana-275612',
//     keyFilename: '/Users/poweitsao/Desktop/ListenReddit/credentials/eternal-arcana-275612-78d4d7540a6a.json',
// });

const addPodcastToDB = async (subreddit, filename, storage_url) => {
    let docRef = db.collection('subreddits').doc(subreddit).collection('podcasts').doc(filename);

    docRef.set({
        filename: filename,
        cloud_storage_url: storage_url,
    }).then(console.log(filename + " added to subreddits" + "/" + subreddit + "/podcasts in Cloud Datastore"))

}

const updateAlbumCover = (subreddit, album_url) => {
    let docRef = db.collection('subreddits').doc(subreddit);
    docRef.set({
        album_cover_url: album_url
    }).then((response) => {
        console.log(response)
    })
}

module.exports = {
    addPodcastToDB,
    updateAlbumCover
}
