const puppeteer = require('puppeteer');

(async () => {
    // Set up browser and page.
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    page.setViewport({width: 1280, height: 926});

    // Import modules from ./modules
    let utils = require('./utils')();
    let getFolowersList = require('./Get_folowers_list')(page, utils);
    let login = require('./login')(page);
    let twofa = require('./2FA')(page, utils);
    let liker = require('./liker')(page, utils);

    //*** Login
    await login.init();

    //*** 2FA
    await utils.sleep(25);
    // await twofa.init();


    //*** Start get_folowers_list
    // await getFolowersList.init();

    //*** Liker
    await liker.init();

    //*** Close the browser.
    await browser.close(); console.log('LOG browser closed');
})();
