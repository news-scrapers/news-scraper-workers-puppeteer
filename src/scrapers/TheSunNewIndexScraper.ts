import  {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {IndexScraper} from "./IndexScraper";

export class TheSunNewIndexScraper extends IndexScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    public maxPages: number
    public scrapingIndex: ScrapingIndexI
    public urls:string[] = []

    constructor(scrapingIndex: ScrapingIndexI, configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.scrapingIndex = scrapingIndex
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
        this.maxPages = scrapingIndex.maxPages
    }

    async extractNewsUrlsInSectionPageFromIndexOneIteration (): Promise<string[]> {

        if (this.scrapingIndex.urlIndex >= this.scrapingIndex.startingUrls.length -1 ){
            this.scrapingIndex.urlIndex = 0
            this.scrapingIndex.pageNewIndex= 1
            this.scrapingIndex.pageIndexSection = 1
        }
        const currentUrl = this.scrapingIndex.startingUrls[this.scrapingIndex.urlIndex]
        const extractedUrls = await this.extractUrlsFromStartingUrl(currentUrl)


        return extractedUrls
    }

    async extractUrlsFromStartingUrl(url: string): Promise<string[]> {
        //https://www.thesun.co.uk/tv
        if (!this.scrapingIndex.pageIndexSection || this.scrapingIndex.pageIndexSection<2) {
            this.scrapingIndex.pageIndexSection = 2
        }

        while (this.scrapingIndex.pageIndexSection <= this.maxPages-1) {
            try {
                const urls = await this.extractUrlsInPage(url,this.scrapingIndex.pageIndexSection)
                this.urls = this.urls.concat(urls)
                this.scrapingIndex.pageIndexSection = this.scrapingIndex.pageIndexSection + 1
            } catch (e) {
                console.log(e)
                this.scrapingIndex.pageIndexSection =2
                return this.urls
            }
        }

        this.scrapingIndex.pageIndexSection =2
        return this.urls
    }

    async extractUrlsInPage (url: string, page: number):Promise<string[]>{
        // https://www.thesun.co.uk/tv/page/1/
        const pageUrl = url + "/page/" + page + "/"

        console.log("\n************");
        console.log("extracting full index in url:")
        console.log(pageUrl);
        console.log("************");
        const urls: string[] = []

        await this.initializePuppeteer();

        try {
            await this.page.goto(pageUrl, {waitUntil: 'load', timeout: 0});
            await this.page.waitFor(this.timeWaitStart);
            await this.clickOkButtonCookie()
            const div = await this.page.$('section.sun-container__home-section');

            const urlsInPage = await  this.extractUrlsFromPage(div);

            await this.browser.close();
            await this.page.waitFor(this.timeWaitStart);

            return urlsInPage

        } catch (err) {
            console.log(err);
            await this.page.screenshot({ path: 'error_extract_new.png' });
            await this.browser.close();
            throw err
        }
    }


    async extractUrlsFromPage(div: any): Promise<string[]>{
        const hrefs = await div.$$eval('a.teaser-anchor', (as:any) => as.map((a:any) => a.href));
        return hrefs
    }

}
