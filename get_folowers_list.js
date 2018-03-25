const fs = require('fs');


class Get_folowers_list {
    constructor(page, utils) {
        this.page = page;
        this.utils = utils;
    }

    async goToFollowers() {
        const {page} = this;

        await page.goto('https://www.instagram.com/_miss_maleficient_/'); // who's followers to get
        let followers_btn = await page.$("a[href$='/_miss_maleficient_/followers/']");
        await followers_btn.click();
    };

    /* This function is injected into the page and used to scrape items from it. */

    extractItems() {
        return () => {
            let followersModal = window.document.getElementsByClassName('_gs38e')[0];
            const extractedElements = followersModal.querySelectorAll('._gs38e a._2g7d5');

            const items = [];
            for (let element of extractedElements) {
                items.push(element.innerText);
            }
            return items;
        };
    };

    /* Scrolls and extracts content from a page.
     * @param {object} page - A loaded Puppeteer Page instance.
     * @param {function} extractItems - Item extraction function that is injected into the page.
     * @param {number} itemTargetConut - The target number of items to extract before stopping.
     * @param {number} scrollDelay - The time (in milliseconds) to wait between scrolls.
     */
    async scrapeInfiniteScrollItems(itemTargetCount, scrollDelay = 100) {


        const {page} = this;

        let items = [];

        try {
            let previousHeight;
            while (items.length < itemTargetCount) {
                items = await page.evaluate(this.extractItems());
                previousHeight = await page.evaluate('window.document.getElementsByClassName(\'_gs38e\')[0].scrollHeight');
                await page.evaluate('window.document.getElementsByClassName(\'_gs38e\')[0].scrollTop += 1000;');
                await page.waitForFunction(`window.document.getElementsByClassName('_gs38e')[0].scrollHeight > ${previousHeight}`);
                await page.waitFor(scrollDelay);
            }
        } catch (err) {
            console.log("Catched error:", err.message);
        }
        console.log('scrapeInfiniteScrollItems items: ', items);
        return items;

    };

    async init() {
        //*** GoTo users followers
        await this.goToFollowers();
        this.utils.sleep(2);

        //*** Scroll and extract items from the page.
        const users = await this.scrapeInfiniteScrollItems(900); //number of followers for get

        //*** Save extracted items to a file.
        fs.writeFileSync('./users-all.txt', users.join('\n') + '\n');
    }
}

module.exports = (page, utils) => {
    return new Get_folowers_list(page, utils);
};