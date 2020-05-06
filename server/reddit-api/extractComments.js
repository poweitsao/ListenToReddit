const extractComments = (response) => {

    var extractedComments = {}
    var keys = []
    for (i = 0; i < response.length; i++) {
        key = "comment" + i
        keys.push(key)
        extractedComments[key] = {
            "text": response[i]["body"],
            "upvotes": response[i]["ups"]
        }
        // console.log(response[i]["body"])
    }
    extractedComments["keys"] = keys

    return extractedComments
}

module.exports = {
    extractComments
}