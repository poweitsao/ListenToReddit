const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectId: 'eternal-arcana-275612',
    keyFilename: '/Users/poweitsao/Desktop/ListenReddit/credentials/eternal-arcana-275612-78d4d7540a6a.json',
});

const addPodcastToDB = (subreddit, filename, storage_url) => {
    let docRef = db.collection('subreddits').doc(subreddit).collection('podcasts').doc(filename);

    docRef.set({
        filename: filename,
        cloud_storage_url: storage_url,
    }).then(console.log(filename + " added to subreddits" + "/" + subreddit + "/podcasts in Cloud FireStore"))

}

const updateAlbumCover = (subreddit, album_url) => {
    let docRef = db.collection('subreddits').doc(subreddit);
    docRef.set({
        album_cover_url: album_url
    }).then((response) => {
        console.log(response)
    })
}
// addPodcastToDB("jokes", "test1")

module.exports = {
    addPodcastToDB,
    updateAlbumCover
}
