import {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'
import {NewScrapedI} from "../models/NewScraped";
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {ContentScraper} from "./ContentScraper";
import {v4} from 'uuid'

export class TheSunNewContentScraper extends ContentScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    public newspaper: string
    public scraperId: string

    constructor(scraperId: string, newspaper: string) {
        super();
        this.newspaper = newspaper
        this.scraperId = scraperId
        this.timeWaitStart = 1 * 1000
        this.timeWaitClick = 500
    }

    async extractNewInUrl(url: string): Promise<NewScrapedI> {
        // https://www.thesun.co.uk/tvandshowbiz/13409249/mark-wright-found-car-stolen-essex/
        console.log("\n---");
        console.log("extracting full new in url:")
        console.log(url);
        console.log("---");

        await this.initializePuppeteer();

        try {
            try {
                await this.page.goto(url, {waitUntil: 'load', timeout: 0});
            } catch (e) {
                return {} as NewScrapedI
            }
            await this.page.waitFor(this.timeWaitStart);
            await this.clickOkButtonCookie()

            const div = await this.page.$('div.article-switcheroo');

            const [content, headline, tags, date, description, image] = await Promise.all([this.extractBody(div), this.extractHeadline(div), this.extractTags(), this.extractDate(), this.extractDescription(), this.extractImage()])

            await this.browser.close();
            await this.page.waitFor(this.timeWaitStart);

            let results = {
                id: v4(),
                url,
                headline,
                content,
                date,
                tags,
                description,
                image,
                scraperId: this.scraperId,
                newspaper: this.newspaper,
                scrapedAt: new Date()
            } as NewScrapedI
            return results;

        } catch (err) {
            console.log(err);
            await this.page.screenshot({path: 'error_extract_new.png'});
            await this.browser.close();
            return null;
        }
    }

    async extractBody(div: any) {
        /*
        const html =  await (await div.getProperty('innerHTML')).jsonValue();
        const text = htmlToText.fromString(html, {
            wordwrap: 130,
            ignoreHref:true
        });
        */
        try {
            const text = await this.page.evaluate(element => element.textContent, div);
            return text
        } catch (e) {
            console.log(e)
            return null
        }

    }

    cleanUp = (text: string) => {
        return text.replace(/\n/g, " ")
    }

    async extractDate(): Promise<Date> {
        try {
            const date = await this.page.$eval("head > meta[property='article:published_time']", (element: any) => element.content);
            return new Date(date)
        } catch (e) {
            return null
        }
    }

    async extractDescription() {
        try {
            const description = await this.page.$eval("head > meta[property='og:description']", (element: any) => element.content);
            return description
        } catch (e) {
            return null
        }
    }

    async extractImage() {
        try {
            const image = await this.page.$eval("head > meta[property='og:image']", (element: any) => element.content);
            return image
        } catch (e) {
            return null
        }
    }

    async extractTags(): Promise<string[]> {
        try {
            let tags = await this.page.$eval("head > meta[property='article:tag']", (element: any) => element.content);
            if (tags && tags.includes(",")) {
                return tags.split(",").map((elem: string) => (elem.trim()))
            }
            return [tags]
        } catch (e) {
            return null
        }

    }

    async clickOkButtonCookie() {
        try {
            const frame = this.page.frames()
            //frame[2].click('button[title="Fine By Me!"]');
        } catch (e) {

        }


    }

    async extractHeadline(div: any) {
        try {
            let headline = await this.page.$eval("head > meta[property='og:title']", (element: any) => element.content);
            return headline
        } catch (e) {
            return null
        }

    }
}
