const PuppeteerScraper = require('./PuppeteerScraper');
const htmlToText = require('html-to-text');

module.exports = class ElPaisHistoricScraper extends PuppeteerScraper {
    constructor(configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.config = require(configPath);
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
    }

    async scrapDate(date) {
        this.date = date;
        //https://elpais.com/tag/fecha/20190305/3
        const dateFormated = this.formatDate(date);
        await this.initializePuppeteer();
        try {
            let results = await this.scrapPage(dateFormated);
            await this.browser.close();
            await this.pageHistoric.waitFor(this.timeWaitStart);
            return results;
        } catch (err) {
            console.log(err);
            await this.pageHistoric.screenshot({ path: 'example.png' });
            await this.browser.close();
            return {};
        }
    }

    async scrapPage(dateFormated){
        let results = [];
        this.urlHistoric = "https://www.elmundo.es/elmundo/hemeroteca/" + dateFormated + "/m/espana.html";
        console.log("\n-------");
        console.log("extracting data for date: " + dateFormated + " in url:");
        console.log(this.urlHistoric);
        console.log("-------");

        await this.pageHistoric.goto(this.urlHistoric, {waitUntil: 'load', timeout: 0});
        //await this.pageHistoric.waitFor(this.timeWaitStart);
        //wait this.clickCookieButton();
        const divs = await this.pageHistoric.$$('a');
        for (const div of divs){
            const newScrapedHeadline = await this.extractFullData(div);
            if (newScrapedHeadline){
                results.push(newScrapedHeadline);
            }
        }
        return results;
    }

    formatDate(date){
        const month = this.pad(2, '' + (date.getMonth() + 1));
        const  day = this.pad(2,'' + date.getDate());
        const  year = date.getFullYear();
        return year +"/"+  month +"/"+  day;
    }
    pad(size, string) {
        while (string.length < (size || 2)) {string = "0" + string;}
        return string;
    }

    async extractFullData(div){
        const aHeadline = div;
        const headline = await (await aHeadline.getProperty('textContent')).jsonValue();
        const url = await (await aHeadline.getProperty('href')).jsonValue();
        if (url.indexOf("www.elmundo.es/espana/")>-1 && url.indexOf("#ancla_comentarios")===-1){
            const content = await this.extractContent(url);
            console.log(url);

            const urlHistoric = this.urlHistoric;
            const scraper_id = this.config.scraper_id;
            const newspaper = this.config.newspaper;
            const date = this.date;
            return {headline, url, content, urlHistoric, scraper_id, newspaper, date}
        }
    }

    async extractContent(url){
        await this.pageSingleNew.goto(url, {waitUntil: 'load', timeout: 0});
        await this.pageSingleNew.waitFor(this.timeWaitStart);

        const div = await this.pageSingleNew.$('main');
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
