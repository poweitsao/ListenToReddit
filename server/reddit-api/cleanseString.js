const cleanseString = (string) => {
    result = JSON.stringify(string).replace(/[^\x00-\x7F]/g, "")
    return string
}

module.exports = {
    cleanseString
}