import {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {IndexScraper} from "./IndexScraper";

export class LATimesIndexScraper extends IndexScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    public maxPages: number
    public scrapingIndex: ScrapingIndexI
    public urls: string[] = []

    constructor(scrapingIndex: ScrapingIndexI) {
        super();
        this.scrapingIndex = scrapingIndex
        this.newspaper = scrapingIndex.newspaper
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
        this.maxPages = scrapingIndex.maxPages
    }

    async extractNewsUrlsInSectionPageFromIndexOneIteration(): Promise<string[]> {
        this.scrapingIndex.pageIndexSection = 1
        if (this.scrapingIndex.urlIndex > this.scrapingIndex.startingUrls.length - 1) {
            this.scrapingIndex.urlIndex = 0
            this.scrapingIndex.pageNewIndex = 1
        }
        try {
            const currentUrl = this.scrapingIndex.startingUrls[this.scrapingIndex.urlIndex]
            const extractedUrls = await this.extractUrlsFromStartingUrl(currentUrl)
            const uniqUrls = [...new Set(extractedUrls)];
            return uniqUrls
        } catch (e) {
            return []
        }

    }

    async extractUrlsFromStartingUrl(url: string): Promise<string[]> {
        try {
            const urls = await this.extractUrlsInPage(url)
            this.urls = this.urls.concat(urls)
        } catch (e) {
            console.log(e)
            return this.urls
        }

        return this.urls
    }

    async extractUrlsInPage(url: string): Promise<string[]> {
        // https://www.thesun.co.uk/tv/page/1/
        const pageUrl = url

        console.log("\n************");
        console.log("extracting full index in url:")
        console.log(pageUrl);
        console.log("************");

        const urls: string[] = []

        await this.initializePuppeteer();

        try {
            await this.page.goto(pageUrl, {waitUntil: 'load', timeout: 0});

            await this.scrollToButtonClickNext()

            const urlsInPage = await this.extractUrlsFromPage();

            await this.browser.close();
            await this.page.waitFor(this.timeWaitStart);

            return urlsInPage

        } catch (err) {
            console.log(err);
            await this.page.screenshot({path: 'error_extract_new.png'});
            await this.browser.close();
            throw err
        }
    }


    async extractUrlsFromPage(): Promise<string[]> {
        let hrefs = await this.page.$$eval('a', (as: any) => as.map((a: any) => a.href));
        const date_regex = /\d{4}-\d{2}-\d{2}/

        //hrefs = ["https://edition.cnn.com/2020/12/24/media/biden-trump-media/index.html"]

        return hrefs.filter((href: string) => {
            return date_regex.test(href) && !href.includes("/videos/")
        })
    }

    async scrollToButtonClickNext() {

        for (let i = 1; i <= 2; i++) {
            try {
                await this.page.evaluate(() => {
                    window.scrollBy(0, 1000);
                })
            } catch (e) {
                //console.log(e)
            }


            let [button] = await this.page.$x("//button[contains(., 'Load More')]");
            if (button) {
                await button.click();
            }
            console.log("scrolling down " + i)
            console.log("clicking down " + i)

            const factor = Math.random() * 0.5
            await this.page.waitFor(this.timeWaitStart * factor);
        }

    }

}
