const PuppeteerScraper = require('./PuppeteerScraper');
const htmlToText = require('html-to-text');

module.exports = class ElPaisHistoricScraper extends PuppeteerScraper {
    constructor(configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.config = require(configPath);
        this.page = 1;
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
    }

    async extractHeadlinesAndUrls(date) {
        //https://elpais.com/tag/fecha/20190305/3
        const dateFormated = this.formatDate(date);
        await this.initializePuppeteer();
        let results = [];
        let morePages = true;
        try {
            while (morePages){
                const pageResults = await this.scrapPage(dateFormated);
                results.push(...pageResults)
                morePages = await this.existsMorePages();
                this.page = this.page + 1;
            }
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
        this.urlHistoric = "https://elpais.com/tag/fecha/" + dateFormated + "/" + this.page;

        console.log("\n-------");
        console.log("extracting data for date:" + dateFormated + " in url:");
        console.log("-- page" + this.page + " --")
        console.log(this.urlHistoric);
        console.log("-------");

        await this.pageHistoric.goto(this.urlHistoric, {waitUntil: 'load', timeout: 0});
        //await this.pageHistoric.waitFor(this.timeWaitStart);
        //wait this.clickCookieButton();
        const divs = await this.pageHistoric.$$('div.articulo__interior');
        for (const div of divs){
            const newScrapedHeadline = await this.extractFullData(div)
            results.push(newScrapedHeadline);
        }
        return results;
    }

    async existsMorePages(){
        const button = await this.pageHistoric.$('li.paginacion-anterior');
        return (button !==undefined && button !==null)
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
