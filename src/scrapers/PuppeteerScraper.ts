import { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import uuidv1 from 'uuid/v1'

//import randomUA = require('modern-random-ua')
import UserAgent from 'user-agents';
const StealthPlugin = require('puppeteer-extra-plugin-stealth')


const userAgent = new UserAgent();

export class PuppeteerScraper {
    public config: any;
    public browser: Browser;
    public pageHistoric: any;
    public api: any;
    public page: Page;

    constructor(configPath= "../config/scrapingConfig.json") {
        this.config = require(configPath);
        this.browser = null;
        this.pageHistoric = null;
        //this.api = new ScraperDataAccess();

        require('dotenv').config();
    }

    async initializePuppeteer() {
        
        console.log("initializing puppeteer");
        this.browser = await puppeteer.use(StealthPlugin()).launch({
            headless: true,
        });
        
        this.page = await this.browser.newPage();
        await this.page.setUserAgent(userAgent.toString())

        function handleClose(msg:any){
            console.log(msg);
            this.page.close();
            this.browser.close();
            process.exit(1);
        }

        process.on("uncaughtException", () => {
            //handleClose(`I crashed`);
        });

        process.on("unhandledRejection", () => {
            handleClose(`I was rejected`);
        });

    }

    async reopenBrowser() {
        await this.browser.close();
        await this.initializePuppeteer()
    }

    async clickOkButtonCookie () {
        try {
            const frame = this.page.frames()
            //frame[2].click('button[title="Fine By Me!"]');
        } catch (e) {

        }


    }


    async savePartialResults(results:any){
       
    }

}