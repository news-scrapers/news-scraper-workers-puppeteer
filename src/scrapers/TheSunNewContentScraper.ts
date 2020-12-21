import  {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'
import {NewScrapedI} from "../models/NewScraped";
import {ScrapingIndexI} from "../models/ScrapingIndex";

export class TheSunNewContentScraper extends PuppeteerScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    public scrapingIndex: ScrapingIndexI
    constructor(scrapingIndex: ScrapingIndexI, configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.scrapingIndex = scrapingIndex
        this.timeWaitStart = 1 * 1000
        this.timeWaitClick = 500
    }

    async extractReviewsInUrl(url: string):Promise<NewScrapedI> {
        // https://www.thesun.co.uk/tvandshowbiz/13409249/mark-wright-found-car-stolen-essex/
        console.log("\n---");
        console.log("extracting full new in url:")
        console.log(url);
        console.log("---");

        await this.initializePuppeteer();

        try {
            await this.page.goto(url, {waitUntil: 'load', timeout: 0});
            await this.page.waitFor(this.timeWaitStart);
            await this.clickOkButtonCookie()
            const div = await this.page.$('div.article-switcheroo');
            const content = await  this.extractBody(div);
            const headline = await this.extractHeadline(div);
            const tags = await this.extractTags()
            const date = await this.extractDate()

            await this.browser.close();
            await this.page.waitFor(this.timeWaitStart);

            let results = {url,headline, content, date,tags, scraperId : this.scrapingIndex.scraperId, scrapedAt:new Date()} as NewScrapedI
            return results;

        } catch (err) {
            console.log(err);
            await this.page.screenshot({ path: 'error_extract_new.png' });
            await this.browser.close();
            return null;
        }
    }

    async extractBody(div: any){
        /*
        const html =  await (await div.getProperty('innerHTML')).jsonValue();
        const text = htmlToText.fromString(html, {
            wordwrap: 130,
            ignoreHref:true
        });
        */
        const text = await this.page.evaluate(element => element.textContent, div);
        return text
    }

    cleanUp = (text: string) => {
        return text.replace(/\n/g, " ")
    }

    async extractDate(): Promise<Date> {
        const date = await this.page.$eval("head > meta[property='article:published_time']", (element:any) => element.content);
        return new Date(date)
    }
    async extractTags(): Promise<string[]> {
        let tags = await this.page.$eval("head > meta[property='article:tag']", (element:any) => element.content);
        if (tags && tags.includes(",")){
            return tags.split(",").map((elem:string) => (elem.trim()))
        }
        return [tags]
    }
    async extractHeadline(div: any) {
        const h1Headline = await div.$('p.article__content--intro');
        const headline = await (await h1Headline.getProperty('textContent')).jsonValue();
        return headline
    }
}
