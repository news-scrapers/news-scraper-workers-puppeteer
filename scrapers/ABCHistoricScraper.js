const PuppeteerScraper = require('./PuppeteerScraper');
const htmlToText = require('html-to-text');

module.exports = class ElPaisHistoricScraper extends PuppeteerScraper {
    constructor(configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.config = require(configPath);
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
        this.maxPages = 81
    }

    //http://hemeroteca.abc.es/nav/Navigate.exe/hemeroteca/madrid/abc/2019/04/10/003.html
    async scrapDate(date) {
        this.date = date;
        //https://elpais.com/tag/fecha/20190305/3
        const dateFormated = this.formatDate(date);
        await this.initializePuppeteer();
        try {
            let scrapedPages = [];
            for (let page =1; page<=this.maxPages; page++) {
                let scrapedPage = await this.scrapPage(dateFormated, page);
                scrapedPages.push(scrapedPage);
            }
            return scrapedPages;
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

    async scrapPage(dateFormated, page){
        const url = `http://hemeroteca.abc.es/nav/Navigate.exe/hemeroteca/madrid/abc/${dateFormated}/${this.pad(3,page)}.html`;

        console.log("\n-------");
        console.log("extracting data for date: " + dateFormated + " in url:");
        console.log(url);
        console.log("-------");
        await this.pageHistoric.goto(url, { waitUntil: 'networkidle2' });

        //lista-resultados
        const div = await this.pageHistoric.$('div#lista-resultados');
        const content = await this.extractContentFromDiv(div);

        const urlHistoric = this.urlHistoric;
        const scraper_id = this.config.scraper_id;
        const newspaper = this.config.newspaper;
        const date = this.date;
        return {url, content, urlHistoric, scraper_id, newspaper, date, page}
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
}
