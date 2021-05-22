const Firestore = require('@google-cloud/firestore');

var file = require("../../credentials/snoopods-us-fada7c2c7858.json")
const admin = require('firebase-admin');

const serviceAccount = require('../../credentials/snoopods-us-fada7c2c7858.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// const db = new Firestore({
//     projectId: 'snoopods-us',
//     credentials: { client_email: file.client_email, private_key: file.private_key }
// });

// const db = new Firestore({
//     projectId: 'eternal-arcana-275612',
//     keyFilename: '/Users/poweitsao/Desktop/ListenReddit/credentials/snoopods-us-fada7c2c7858.json',
// });

const addPodcastToDB = async (subreddit, track_id, post_title, storage_url, audio_length, date_posted) => {

    const checkSubredditRef = db.collection('subreddits').where("subredditName", "==", subreddit)

    var subredditSnapshot = await checkSubredditRef.get()
    // console.log(subredditSnapshot)
    if(subredditSnapshot.empty){

        var collectionID = await createCollection(subreddit+"'s Collection", "admin", [])
        const newestUpdatesCollectionID = await createCollection(subreddit+"'s Latest Updates", "admin", [])
        const newSubredditRef = db.collection("subreddits").doc(subreddit)
        // console.log(typeof(collectionID), collectionID)

        await newSubredditRef.set({
            mainCollectionID: collectionID,
            newestUpdatesCollectionID: newestUpdatesCollectionID,
            pictureURL: "https://img.icons8.com/fluent/800/000000/image.png",
            subredditName: subreddit,
        })

    } 


    let trackRef = db.collection('tracks').doc(track_id)
    
    try{
        await trackRef.set({
            trackID: track_id,
            trackName: post_title,
            filename: track_id + ".mp3",
            cloudStorageURL: storage_url,
            audioLength: audio_length,
            datePosted: date_posted
        })
        console.log(track_id + ".mp3 added to subreddits" + "/" + subreddit + "/podcasts in Cloud Datastore")
        const subredditDoc = await db.collection('subreddits').doc(subreddit).get()
        const collectionID = subredditDoc.data()["mainCollectionID"]

        const subredditCollectionRef = db.collection("collections").doc(collectionID)
        
        await subredditCollectionRef.update({
            tracks: admin.firestore.FieldValue.arrayUnion(track_id)
        })


    } catch(e){
        console.error("error in uploading track", e)
    }
    

}

const createCollection = async (collectionName, ownerID, tracks) => {
    // console.log("creating collection", collectionName)
    try{
        const res = await db.collection("collections").add({
            collectionID: "",
            collectionName: collectionName,
            ownerID: ownerID, 
            tracks: tracks
        })
        var key = res.id 
        await db.collection("collections").doc(res.id).update({collectionID: key})
        return key
    } catch(e){
        console.error("error in createCollection", e)
    }
}

const updateAlbumCover = (subreddit, album_url) => {
    let docRef = db.collection('subreddits').doc(subreddit);
    docRef.set({
        album_cover_url: album_url
    }).then((response) => {
        console.log(response)
    })
}

// createCollection("newtestCollection", "admin", ["track1", "track2"])
// var today = new Date()
// addPodcastToDB("poreddit", "newtrack2", "new track's post title", "www.google.com", 30, today)

module.exports = {
    addPodcastToDB,
    updateAlbumCover
}
