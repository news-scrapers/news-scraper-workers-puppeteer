import  {PuppeteerScraper} from './PuppeteerScraper'
import htmlToText from 'html-to-text'

export class ElPaisNewContentScraper extends PuppeteerScraper {
    public timeWaitStart: number
    public timeWaitClick: number
    constructor(configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
    }

    async extractReviewsInUrl(url: string) {
        // https://elpais.com/economia/2019/03/01/actualidad/1551457314_646821.html
        console.log("\n---");
        console.log("extracting full new in url:")
        console.log(url);
        console.log("---");

        await this.initializePuppeteer();

        try {
            await this.page.goto(url, {waitUntil: 'load', timeout: 0});
            await this.page.waitFor(this.timeWaitStart);

            const div = await this.page.$('div.articulo__interior');
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

    async extractBody(div: any){
        const html =  await (await div.getProperty('innerHTML')).jsonValue();
        const text = htmlToText.fromString(html, {
            wordwrap: 130
        });
        return text
    }
    async extractHeadline(div: any){
        const h1Headline = await div.$('h1');
        const headline = await (await h1Headline.getProperty('textContent')).jsonValue();
        return headline
    }
}
