class Twofa {
    constructor(page, utils) {
        this.page = page;
        this.utils = utils;
    }

    //*** Read Pin from file
    async readpin(input) {
        console.log('readpin started');
        const fs = require('fs');
        let data = fs.readFileSync('./pin.txt', "utf8");
        let pin = data.toString();
        console.log(pin);
        await this.page.waitForSelector('input[name="' + input + '"]');
        await this.page.type('input[name="' + input + '"]', pin, {delay: 100});
        this.utils.sleep(this.utils.random_interval(4, 8));
    }

    //*** Open pin.txt and insert in security-code input
    async submitform() {
        console.log('submit form started');
        try {
            await this.page.waitForSelector('form button');
            let button = await this.page.$('form button');
            await button.click();
        } catch (err) {
            console.log("ERROR 2FA: ", err);
        }
    }

    async submitverify(selector) {
        await this.page.$('input[name="' + selector + '"]');
        this.utils.sleep(this.utils.random_interval(3, 7));
        await this.page.$('input[name="username"]');
        this.utils.sleep(this.utils.random_interval(3, 7));
    }

    async init() {
        console.log('2FA started');
        this.utils.sleep(60);

        await this.readpin("verificationCode"); //read pin from the file
        this.utils.sleep(this.utils.random_interval(3, 7));
        await this.submitform();
        this.utils.sleep(this.utils.random_interval(3, 7));
        let status = await this.submitverify("verificationCode");
        this.utils.sleep(this.utils.random_interval(3, 7));
        return status;
    }
}

module.exports = (page, utils) => {
    return new Twofa(page, utils);
};