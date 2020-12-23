import  {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'
import {NewScrapedI} from "../models/NewScraped";
import {ScrapingIndexI} from "../models/ScrapingIndex";
import {ContentScraper} from "./ContentScraper";
import {v4} from 'uuid'

export class BBCNewContentScraper extends ContentScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    public excludedParagraphs = ["Please include a contact number if you are willing to speak to a BBC journalist", "If you are reading this page and can't see the form" ]

    constructor() {
        super();
        this.timeWaitStart = 1 * 1000
        this.timeWaitClick = 500
    }

    async extractNewInUrl(url: string, scraperId: string):Promise<NewScrapedI> {
        // https://www.thesun.co.uk/tvandshowbiz/13409249/mark-wright-found-car-stolen-essex/
        console.log("\n---");
        console.log("extracting full new in url:")
        console.log(url);
        console.log("---");

        await this.initializePuppeteer();

        try {
            await this.page.goto(url, {waitUntil: 'load', timeout: 0});

            const div = await this.page.$('article');
            const [content, headline, tags, date] = await Promise.all([this.extractBody(div),this.extractHeadline(div), this.extractTags(div), this.extractDate(div)])

            await this.browser.close();
            await this.page.waitFor(this.timeWaitStart);

            let results = {id:v4(), url,headline, content, date,tags, scraperId, scrapedAt:new Date()} as NewScrapedI
            return results;

        } catch (err) {
            console.log(err);
            await this.page.screenshot({ path: 'error_extract_new.png' });
            await this.browser.close();
            return null;
        }
    }

    async extractBody(div: any){
        try{
            const pars = await div.$$("div[data-component='text-block']")
            let text = ''
            for (let par of pars) {
                const textPar = await this.page.evaluate(element => element.textContent, par);
                const hasExcludedText = this.excludedParagraphs.some((text)=>textPar.includes(text))
                if (!hasExcludedText) {
                    text = text + '\n ' + textPar
                }
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

    async extractDate(div: any): Promise<Date> {
        try {
            const date = await div.$eval("time", (el:any) => el.getAttribute("datetime"))
            return new Date(date as string)
        } catch (e) {
            console.log(e)
            return null
        }

    }
    async extractTags(div:any): Promise<string[]> {
        try{
            const tags = await div.evaluate(() => {
                const as = document.getElementsByTagName('a')
                const tags = []

                for (let a of as) {
                    if (a.href.includes("/topics/")){
                        tags.push(a.textContent)
                    }
                }
                return tags
            });
            return tags

        } catch (e) {
            console.log(e)
            return null
        }

    }
    async extractHeadline(div: any) {
        try{
            const h1Headline = await div.$('h1#main-heading');
            const headline = await (await h1Headline.getProperty('textContent')).jsonValue();
            return headline
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

}
