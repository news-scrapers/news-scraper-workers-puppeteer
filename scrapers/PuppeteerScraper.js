const puppeteer = require('puppeteer');
const randomUA = require('modern-random-ua');
const uuidv1 = require('uuid/v1');


module.exports = class PuppeteerScraper {
    constructor(configPath= "../config/scrapingConfig.json") {
        this.config = require(configPath);
        this.browser = null;
        this.pageHistoric = null;

        require('dotenv').config();
    }

    async initializePuppeteer() {
        if (process.env['RASPBERRY_MODE']) {
            console.log("initializing puppeteer using raspberry config");
            this.browser = await puppeteer.launch({
                executablePath: '/usr/bin/chromium-browser',
                userAgent: randomUA.generate(),
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        } else {
            console.log("initializing puppeteer");
            this.browser = await puppeteer.launch({
                userAgent: randomUA.generate(),
                headless: true,
                args: ['--no-sandbox']
            });
        }
        this.pageHistoric = await this.browser.newPage();
        this.pageSingleNew = await this.browser.newPage();

        function handleClose(msg){
            console.log(msg);
            page.close();
            browser.close();
            process.exit(1);
        }

        process.on("uncaughtException", () => {
            handleClose(`I crashed`);
        });

        process.on("unhandledRejection", () => {
            handleClose(`I was rejected`);
        });

    }

    async reopenBrowser() {
        await this.browser.close();
        await this.initializePuppeteer()
    }

    generateId(){
        let date = new Date().toString().replace(new RegExp(" ", 'g'), "_").replace(new RegExp(":", 'g'), "_").replace(new RegExp(",", 'g'), "_").replace("+", "_");
        date = date.split("_GMT")[0];
        return this.config.scraper_id + "-" + date + "-" + uuidv1()
    }
}
