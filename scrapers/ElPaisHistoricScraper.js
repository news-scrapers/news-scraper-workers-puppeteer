const PuppeteerScraper = require('./PuppeteerScraper');
const htmlToText = require('html-to-text');
const ScraperDataAccess = require("../ScraperDataAccess");

module.exports = class ElPaisHistoricScraper extends PuppeteerScraper {
    constructor(configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
        this.newsCounter = 0;
        this.api = new ScraperDataAccess();

    }

    async scrapDate(date, scrapingIndex) {
        this.date = date;
        //https://elpais.com/tag/fecha/20190305/3
        const dateFormated = this.formatDate(date);
        await this.initializePuppeteer();
        let results = [];
        const currentPage = scrapingIndex.page || 0;
        try {
            for (let page =currentPage ; page<=10; page++){
                const pageResults = await this.scrapPage(dateFormated, page);
                scrapingIndex.page = page;
                await this.saveCurrentScrapingIndex(scrapingIndex);
                for (let result of pageResults){
                   const url = result.url;
                       if (this.isNewUrl(url)) {
                           const content = await this.extractContent(url);
                           result.content = content;
                           results.push(...pageResults)
                       }
                }
            }
            scrapingIndex.page = 0;
            await this.saveCurrentScrapingIndex(scrapingIndex);
            await this.browser.close();
            return results;
        } catch (err) {
            console.log(err);
            await this.pageHistoric.screenshot({ path: 'example.png' });
            await this.browser.close();
            return {};
        }
    }

    isNewUrl(url) {
        return url.indexOf(".htm") > -1
    }

    async scrapPage(dateFormated, page){
        let results = [];
        this.urlHistoric = "https://elpais.com/tag/fecha/" + dateFormated + "/" + page;

        console.log("\n-------");
        console.log("extracting data for date:" + dateFormated + " in url:");
        console.log("-- page" + page + " --")
        console.log(this.urlHistoric);
        console.log("-------");
        try {
            await this.pageHistoric.goto(this.urlHistoric, {waitUntil: 'load', timeout: 0});
            //await this.pageHistoric.waitFor(this.timeWaitStart);
            //wait this.clickCookieButton();
            const divs = await this.pageHistoric.$$('div.articulo__interior');
            for (const div of divs){
                const newScrapedHeadline = await this.extractUrlAndHeadline(div);
                results.push(newScrapedHeadline);
            }
        } catch (err) {
            console.log(err);
            //throw err;
        }
        return results;
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

    async extractUrlAndHeadline(div){
        // articulo-titulo
        if (div) {
            const h2Headline = await div.$('h2');
            const aHeadline = await div.$('a');
            const headline = await (await h2Headline.getProperty('textContent')).jsonValue();
            const url = await (await aHeadline.getProperty('href')).jsonValue();
            //const content = await this.extractFullPageNews(url);
            //console.log("++++");
            console.log(url);
            //console.log(headline.substring(0, 100));
            //console.log(content.substring(0, 100));
            //console.log("++++");
            const urlHistoric = this.urlHistoric;
            const scraper_id = this.config.scraper_id;
            const newspaper = this.config.newspaper;
            const date = this.date;
            const id = this.generateId(date);
            const result = {headline, url, urlHistoric, scraper_id, newspaper, date, id};
            return result;
        }
    }

    async extractContent(url){
        console.log("extracting content of ");
        console.log(url);
        try{
            await this.pageHistoric.goto(url, {waitUntil: 'load', timeout: 0});
            const div = await this.pageHistoric.$('div.articulo__interior');
            const content = await this.extractContentFromDiv(div);
            this.newsCounter = this. newsCounter+1;
            if (this.newsCounter > 2 ){
                await this.reopenBrowser();
                this.newsCounter = 0;
            }
            return content;
        } catch (err) {
          console.log(err);
        }

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

    async saveCurrentScrapingIndex(scrapingIndex){
        console.log("saving index ");
        scrapingIndex.date_scraping = new Date();
        console.log(scrapingIndex);
        await this.api.saveScrapingIndex(scrapingIndex);
    }
}
