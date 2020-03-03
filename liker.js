const fs = require('fs');
const colors = require('colors');

class Liker {
    constructor(page, utils) {
        this.page = page;
        this.utils = utils;
    }

    async goToUser(user) {
        const {page} = this;
        await this.utils.sleep(2);
        await page.goto('https://www.instagram.com/' + user + '/');
    };

    async getImgUrls() {
        /* This function is injected into the page and used to scrape items from it. */
        let extractItems = () => {
            let img_urls = []; //array of img urls TODO: REMOVE LINE???
            let elements = window.document.querySelectorAll('article a');
            elements.forEach((element) => img_urls.push(element.href)); //add img url to the array
            return img_urls;
        };

        let img_urls = [];
        const {page} = this;

        try {
            img_urls = await page.evaluate(extractItems);
        } catch (err) {
            console.log("ERR img_urls error:".red, err.message);
        }

        console.log('LOG Number of images: '.green, img_urls.length);
        console.log('LOG img_urls: \n'.green, img_urls);
        return img_urls;
    };

    async likeUserPosts(img_urls) {
        const {page} = this;
        let min = 3, max = 6; //How many images to like of one user

        //*** Check if user has enough images
        if (img_urls.length < max) {
            console.log('SKIPPED: User has not enough images or account is private!'.yellow);
            return;
        }

        let num_of_images = this.utils.random_interval(min, max);

        //like images of a user
        for (let j = 0; j < num_of_images; j++) {
            const current = this.utils.random_interval(1, img_urls.length - 1); //get a random image url
            console.log('LOG Current image: '.green, current, img_urls[current]);

            this.utils.sleep(this.utils.random_interval(1, 4)); //delay before liking
            await page.goto(img_urls[current]);

            try {
                let heart = await this.page.$('svg[aria-label="Like"]');

                if (heart == null) {
                    console.log('LOG image is already liked!'.yellow);
                } else {
                    try {
                        await this.utils.sleep(this.utils.random_interval(1.5, 3.2));
                        await heart.click();
                        console.log('LOG Liked!'.rainbow);
                    } catch (err) {
                        console.log("ERR heart.click".red, err.message);
                    }
                }
            } catch (err) {
                console.log('Heart check error'.red, err);
            }
        }
    }

    async getContent() {
        let data = fs.readFileSync('./users-selected.txt', 'utf8');
        let users = data.split('\n');
        return users;
    }

    async init() {
        let users = await this.getContent(); // get an array of users
        let img_urls;

        //*** loop through users
        for (let i = 0; i <= users.length-1; i++) {
            console.log('LOG Current User: '.green, users[i]);
            await this.goToUser(users[i]);
            img_urls = await this.getImgUrls();
            await this.likeUserPosts(img_urls);
        }
    }
}

module.exports = (page, utils) => {
    return new Liker(page, utils);
};