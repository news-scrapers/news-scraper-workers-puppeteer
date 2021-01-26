import  {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'
import {NewScrapedI} from "../models/NewScraped";
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {ContentScraper} from "./ContentScraper";
import {v4} from 'uuid'

export class UsatodayNewContentScraper extends ContentScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    public newspaper: string
    public scraperId: string

    constructor(scraperId: string, newspaper:string) {
        super();
        this.newspaper = newspaper
        this.scraperId = scraperId
        this.timeWaitStart = 1 * 1000
        this.timeWaitClick = 500
    }

    async extractNewInUrl(url: string):Promise<NewScrapedI> {
        console.log("\n---");
        console.log("extracting full new in url:")
        console.log(url);
        console.log("---");

        await this.initializePuppeteer();

        try {
            try {
                await this.page.goto(url, {waitUntil: 'load', timeout: 0});
            } catch (e){
                return {} as NewScrapedI
            }

            const [content, headline, author, date] = await Promise.all([this.extractBody(),this.extractHeadline(), this.extractAuthor(), this.extractDate()])

            await this.browser.close();
            await this.page.waitFor(this.timeWaitStart);

            let results = {id:v4(), url,headline, content, date,author , scraperId:this.scraperId, newspaper:this.newspaper, scrapedAt:new Date()} as NewScrapedI
            return results;

        } catch (err) {
            console.log(err);
            await this.page.screenshot({ path: 'error_extract_new.png' });
            await this.browser.close();
            return null;
        }
    }

    async extractBody(){
        try{
            const article = await this.page.$("article")
            const pars = await article.$$("p")
            let text = ''
            for (let par of pars) {
                const textPar = await this.page.evaluate(element => element.textContent, par);

                    text = text + '\n ' + textPar

            }
            return text
        } catch (e){
            console.log(e)
            return null
        }

    }
    cleanUp = (text: string) => {
        return text.replace(/\n/g, " ")
    }

    async extractDate(): Promise<Date> {
        try {
            const date = await this.page.$eval("lit-timestamp", (element:any) => element);
            return new Date(date.__publishDate)
        } catch (e) {
            return null
        }

    }

    async extractAuthor(): Promise<string> {
        try {
            const aut = await this.page.$("a.authors")
            const author = await this.page.evaluate(element => element.textContent, aut);
            return author
        } catch (e) {
            return null
        }

    }

    async extractTags(): Promise<string[]> {
        try{
            let tags = await this.page.$eval("head > meta[name='keywords']", (element:any) => element.content);
            if (tags && tags.includes(",")){
                return tags.split(",").map((elem:string) => (elem.trim()))
            }
            return [tags]
        } catch (e) {
            return null
        }

    }

    async clickOkButtonCookie () {
        try {
            const frame = this.page.frames()
            //frame[2].click('button[title="Fine By Me!"]');
        } catch (e) {

        }


    }

    async extractHeadline() {
        try{
            const headline = await this.page.$eval("title", (element:any) => element.textContent);
            return headline
        } catch (e) {
            return null
        }

    }
}
