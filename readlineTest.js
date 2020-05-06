const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("What subreddit do you want to create a podcast for?", (subreddit) => {
    rl.question("What category of top posts do you want? (daily, monthly or annually)", (category) => {
        console.log(`You've created a podcast for r/${subreddit} consisting of the top ${category} posts.`);
        rl.close();
    })
})


// rl.question("What is your name ? ", function (name) {
//     rl.question("Where do you live ? ", function (country) {
//         console.log(`${name}, is a citizen of ${country}`);
//         rl.close();
//     });
// });

// rl.on("close", function () {
//     console.log("\nBYE BYE !!!");
//     process.exit(0);
// });