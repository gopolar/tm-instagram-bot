const config = require('./config');

class Login {
    constructor(page) {
        this.page = page;
    }

    async init() {
        const {page} = this;

        await page.goto('https://www.instagram.com/accounts/login/');
        await page.bringToFront();

        /* Set username and password */
        await page.waitForSelector('input[name="username"]');
        await page.type('input[name="username"]', config.USER, {delay: 7});
        await page.waitForSelector('input[name="password"]');
        await page.type('input[name="password"]', config.PASS, {delay: 7});

        /* Press submit button */
        await page.waitForSelector('form button[type="submit"]');
        let button = await page.$('form button[type="submit"]');
        await button.click();
        await page.waitForNavigation(); //waits for page to load
        console.log('Logged in'.rainbow);
    }
}

module.exports = (page) => {
    return new Login(page);
};