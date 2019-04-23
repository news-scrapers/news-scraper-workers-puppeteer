const PuppeteerScraper = require('./PuppeteerScraper');
const htmlToText = require('html-to-text');

module.exports = class ElPaisHistoricScraper extends PuppeteerScraper {
    constructor(configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.config = require(configPath);

        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
    }

    async extractHeadlinesAndUrls(date) {
        //https://elpais.com/tag/fecha/20190305/3
        const dateFormated = this.formatDate(date);
        this.urlHistoric = "https://elpais.com/tag/fecha/" + dateFormated + "/3";

        console.log("\n---");
        console.log("extracting data for date:" + dateFormated + " in url:")
        console.log(this.urlHistoric);
        console.log("---");

        await this.initializePuppeteer();

        try {
            await this.pageHistoric.goto(this.urlHistoric, {waitUntil: 'load', timeout: 0});
            await this.pageHistoric.waitFor(this.timeWaitStart);
            //wait this.clickCookieButton();
            let results = []
            const divs = await this.pageHistoric.$$('div.articulo__interior');
            for (const div of divs){
                const newScrapedHeadline = await this.extractFullData(div)
                results.push(newScrapedHeadline);
            }
            await this.browser.close();
            await this.pageHistoric.waitFor(this.timeWaitStart);

            return results;

        } catch (err) {
            console.log(err);
            await this.pageHistoric.screenshot({ path: 'example.png' });
            await this.browser.close();
            return null;
        }
    }
    async clickCookieButton(){
        try{
            const button = await this.pageHistoric.$$('button.didomi-dismiss-button');
            await button.click();
            await this.pageHistoric.waitFor(this.timeWaitStart);
        } catch (e) {
            console.log(e);
        }
    }
    //didomi-dismiss-button
    formatDate(date){
        const month = this.pad(2, '' + (date.getMonth() + 1));
        const  day = this.pad(2,'' + date.getDate());
        const  year = date.getFullYear();
        return year + month + day;
    }
    pad(size, string) {
        while (string.length < (size || 2)) {string = "0" + string;}
        return string;
    }

    async extractFullData(div){
        // articulo-titulo
        const h2Headline = await div.$('h2');
        const aHeadline = await div.$('a');
        const headline = await (await h2Headline.getProperty('textContent')).jsonValue();
        const url = await (await aHeadline.getProperty('href')).jsonValue();
        const content = await this.extractContent(url);
        //console.log("++++");
        console.log(url);
        //console.log(headline.substring(0, 100));
        //console.log(content.substring(0, 100));
        //console.log("++++");
        const urlHistoric = this.urlHistoric;
        const scraper_id = this.config.scraper_id;
        const newspaper = this.config.newspaper;
        return {headline, url, content, urlHistoric, scraper_id, newspaper}

    }

    async extractContent(url){
        await this.pageSingleNew.goto(url, {waitUntil: 'load', timeout: 0});
        await this.pageSingleNew.waitFor(this.timeWaitStart);

        const div = await this.pageSingleNew.$('div.articulo__interior');
        const content = await this.extractContentFromDiv(div);
        return content;
    }

    async extractContentFromDiv(div){
        try{
            const html =  await (await div.getProperty('innerHTML')).jsonValue();
            const text = htmlToText.fromString(html, {
                wordwrap: 130
            });
            return text
        } catch (e) {
            console.log(e);
            return ""
        }
    }
}
