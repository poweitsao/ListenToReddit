const fs = require('fs')
const r = require("./snoowrapSetup.js")
const { extractPostContent } = require("./extractPostContent")


async function getTopPosts(subreddit, time, limit) {
    const content = await r.getTop(subreddit, { time: time })
    return content

    // const filteredContent = await extractPostContent(content)
    // return filteredContent
}

async function getTopPostsTest() {
    const contentTest = require("../../json/contentTest.json")
    const filteredContent = await extractPostContent(contentTest)
    // console.log(filteredContent)
}


module.exports = {
    getTopPosts,
    getTopPostsTest
}




