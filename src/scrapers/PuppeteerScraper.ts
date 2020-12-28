import { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import uuidv1 from 'uuid/v1'

//import randomUA = require('modern-random-ua')
import UserAgent from 'user-agents';
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const userAgent = new UserAgent();

export class PuppeteerScraper {
    public browser: Browser;
    public pageHistoric: any;
    public api: any;
    public page: Page;

    constructor() {
        this.browser = null;
        this.pageHistoric = null;
        //this.api = new ScraperDataAccess();

        require('dotenv').config();
    }

    async initializePuppeteer() {
        
        console.log("initializing puppeteer");
        //puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

        this.browser = await puppeteer.use(StealthPlugin()).launch({
            headless: true,
            ignoreHTTPSErrors: true,
            slowMo: 0,
            args: ['--window-size=1400,900',
                '--remote-debugging-port=9222',
                "--remote-debugging-address=0.0.0.0", // You know what your doing?
                '--disable-gpu', "--disable-features=IsolateOrigins,site-per-process", '--blink-settings=imagesEnabled=false']
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


    async savePartialResults(results:any){
       
    }

}