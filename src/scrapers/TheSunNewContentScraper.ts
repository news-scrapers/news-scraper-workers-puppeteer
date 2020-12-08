import  {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'

export class TheSunNewContentScraper extends PuppeteerScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    constructor(configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
    }

    async extractReviewsInUrl(url: string) {
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
            const headline = await this.extractHeadline(div);
            const content = await  this.extractBody(div);

            await this.browser.close();
            await this.page.waitFor(this.timeWaitStart);

            let results = {headline, content}
            return results;

        } catch (err) {
            console.log(err);
            await this.page.screenshot({ path: 'error_extract_new.png' });
            await this.browser.close();
            return null;
        }
    }

    async clickOkButtonCookie () {

            await this.page.click('button[title="Fine By Me!"]');

    }

    async extractBody(div: any){
        const html =  await (await div.getProperty('innerHTML')).jsonValue();
        const text = htmlToText.fromString(html, {
            wordwrap: 130
        });
        return text
    }
    async extractHeadline(div: any){
        const h1Headline = await div.$('div.article__content--intro');
        const headline = await (await h1Headline.getProperty('textContent')).jsonValue();
        return headline
    }
}
