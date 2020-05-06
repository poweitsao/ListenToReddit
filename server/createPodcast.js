const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("\nWhat subreddit do you want to create a podcast for? ", (subreddit) => {
    rl.question("\nDo you want the default option podcast configuration? (yes/no) ", (defaultConfig) => {
        if (defaultConfig == "yes") {
            console.log(`\nCreating podcast with default config for r/${subreddit}`)
            rl.close();
        } else {
            customPodcast(subreddit);
        }
    })


})

const customPodcast = (subreddit) => {

    rl.question("\nWhat category of top posts do you want? (daily, monthly or annually) ", (category) => {
        console.log(`\nYou've created a podcast for r/${subreddit} consisting of the top ${category} posts.`);
        rl.close();

    })

}

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