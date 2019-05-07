const PuppeteerScraper = require('./PuppeteerScraper');
const htmlToText = require('html-to-text');
const ScraperDataAccess = require("../ScraperDataAccess");

module.exports = class ElPaisHistoricScraper extends PuppeteerScraper {
    constructor(configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
        this.maxPages = 81
        this.api = new ScraperDataAccess();

    }

    //http://hemeroteca.abc.es/nav/Navigate.exe/hemeroteca/madrid/abc/2019/04/10/003.html
    async scrapDate(date, scrapingIndex) {
        this.date = date;
        //https://elpais.com/tag/fecha/20190305/3
        const dateFormated = this.formatDate(date);
        await this.initializePuppeteer();
        try {
            let scrapedPages = [];
            const currentPage = scrapingIndex.page || 0;

            for (let page =currentPage; page<=this.maxPages; page++) {
                let scrapedPage = await this.scrapPage(dateFormated, page);
                scrapingIndex.page = page;
                await this.saveCurrentScrapingIndex(scrapingIndex);
                if (scrapedPage && scrapedPage.content) scrapedPages.push(scrapedPage);
            }
            scrapingIndex.page = 0;
            await this.saveCurrentScrapingIndex(scrapingIndex);

            await this.browser.close();
            await this.pageHistoric.waitFor(this.timeWaitStart);
            return scrapedPages;
        } catch (err) {
            console.log(err);
            await this.pageHistoric.screenshot({ path: 'example.png' });
            await this.browser.close();
            return {};
        }
    }

    async scrapPage(dateFormated, page){
        const url = `http://hemeroteca.abc.es/nav/Navigate.exe/hemeroteca/madrid/abc/${dateFormated}/${this.pad(3,page)}.html`;

        console.log("\n-------");
        console.log("extracting data for date: " + dateFormated + " in url:");
        console.log(url);
        console.log("-------");
        try {
            await this.pageHistoric.goto(url, { waitUntil: 'networkidle2' });

            //lista-resultados
            const div = await this.pageHistoric.$('div#lista-resultados');
            const content = await this.extractContentFromDiv(div);

            const urlHistoric = this.urlHistoric;
            const scraper_id = this.config.scraper_id;
            const newspaper = this.config.newspaper;
            const date = this.date;
            const id = this.generateId(date);
            await this.reopenBrowser();
            return {url, content, urlHistoric, scraper_id, newspaper, date, page, full_page:true, id};
        } catch (err) {
            console.log(err);
        }

    }

    formatDate(date){
        const month = this.pad(2, '' + (date.getMonth() + 1));
        const  day = this.pad(2,'' + date.getDate());
        const  year = date.getFullYear();
        return "" + year +"/"+  month  +"/"+  day;
    }
    pad(size, string) {
        string = "" + string;
        while (string.length < (size || 2)) {string = "0" + string;}
        return string;
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
