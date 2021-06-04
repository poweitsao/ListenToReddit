/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Name of a bucket, e.g. my-bucket';
// const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';

// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

// Creates a client

var file = require("../../credentials/snoopods-us-fada7c2c7858.json")

const storage = new Storage({
    projectId: 'snoopods-us',
    keyFilename: '/Users/poweitsao/Documents/coding/snoopods project/ListenToReddit/credentials/snoopods-us-fada7c2c7858.json',
});

async function uploadFile(bucketName, filename) {
    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        // gzip: false,
        // By setting the option `destination`, you can change the name of the
        // object you are uploading to a bucket.
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        },
    });

    console.log(`${filename} uploaded to ${bucketName}.`);
}

async function uploadTrack(bucketName, filename) {
    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        // gzip: false,
        // By setting the option `destination`, you can change the name of the
        // object you are uploading to a bucket.
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        },
    });

    console.log(`${filename} uploaded to ${bucketName}.`);
}

async function moveFile(bucketName, source, destination) {
    // Moves the file within the bucket
    await storage.bucket(bucketName).file(source).move(destination);
    console.log(`${source} moved to ${destination}.`);

}
const getFileURL = (objectLocation, filename) => {
    return "https://storage.cloud.google.com/" + objectLocation + "/" + encodeURIComponent(filename);
}

async function getMetadata(bucketName, folder, filename) {
    // Gets the metadata for the file
    filename = folder + "/" + filename
    const [metadata] = await storage.bucket(bucketName).file(filename).getMetadata();

    console.log(`File: ${metadata.name}`);
    console.log(`Bucket: ${metadata.bucket}`);
    console.log(`Storage class: ${metadata.storageClass}`);
    console.log(`Self link: ${metadata.selfLink}`);
    console.log(`ID: ${metadata.id}`);
    console.log(`Size: ${metadata.size}`);
    console.log(`Updated: ${metadata.updated}`);
    console.log(`Generation: ${metadata.generation}`);
    console.log(`Metageneration: ${metadata.metageneration}`);
    console.log(`Etag: ${metadata.etag}`);
    console.log(`Owner: ${metadata.owner}`);
    console.log(`Component count: ${metadata.component_count}`);
    console.log(`Crc32c: ${metadata.crc32c}`);
    console.log(`md5Hash: ${metadata.md5Hash}`);
    console.log(`Cache-control: ${metadata.cacheControl}`);
    console.log(`Content-type: ${metadata.contentType}`);
    console.log(`Content-disposition: ${metadata.contentDisposition}`);
    console.log(`Content-encoding: ${metadata.contentEncoding}`);
    console.log(`Content-language: ${metadata.contentLanguage}`);
    console.log(`Media link: ${metadata.mediaLink}`);
    console.log(`KMS Key Name: ${metadata.kmsKeyName}`);
    console.log(`Temporary Hold: ${metadata.temporaryHold}`);
    console.log(`Event-based hold: ${metadata.eventBasedHold}`);
    console.log(
        `Effective Expiration Time: ${metadata.effectiveExpirationTime}`
    );
    console.log(`Metadata: ${metadata.metadata}`);
    // if 
    // getMetadata().catch(console.error);

}

async function setEncoding(bucketName, folder, filename) {
    // Gets the metadata for the file
    filename = folder + "/" + filename
    const [metadata] = await storage.bucket(bucketName).file(filename).getMetadata();
    console.log(metadata)
    // await storage.bucket(bucketName).file(filename).setMetadata({ contentEncoding: undefined }, (err, response) => { });

}
// uploadFile("listen-to-reddit-test", "../../audio/juju2.mp3").catch(console.error).then(() => {
//     moveFile("listen-to-reddit-test", "juju2.mp3", "podcasts/juju2.mp3")
// })

module.exports = {
    uploadFile,
    moveFile,
    getFileURL,
    getMetadata,
    setEncoding,
    uploadTrack
}