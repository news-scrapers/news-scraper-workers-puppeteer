const PuppeteerScraper = require('./PuppeteerScraper');
const htmlToText = require('html-to-text');

module.exports = class ElPaisHistoricScraper extends PuppeteerScraper {
    constructor(configPath= "../config/scrapingConfig.json") {
        super(configPath);
        this.page = 1;
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
        this.newsCounter = 0;
    }

    async scrapDate(date, scrapingIndex) {
        this.date = date;
        //http://hemeroteca.lavanguardia.com/edition.html?bd=31&bm=12&by=2018&page=6
        const dateFormated = this.formatDate(date);
        await this.initializePuppeteer();
        let results = [];
        try {
            if (scrapingIndex.page ===0 ) scrapingIndex.page = 1;
            const currentPage = scrapingIndex.page || 1;
            const currentUrlIndex = scrapingIndex.url_index || 0;
            for (let page =currentPage; page<=6; page++){
                const urls = await this.extractNewsPagesUrls(dateFormated, page);
                scrapingIndex.page = page;
                await this.saveCurrentScrapingIndex(scrapingIndex);
                const pageResults = [];
                for (let urlIndex =currentUrlIndex ; urlIndex<=pageResults.length; urlIndex++){
                   const result = await this.extractFullPageNews(urls[urlIndex], urlIndex+1);
                    await this.savePartialResults([result]);
                   pageResults.push(result)
                }
                await this.savePartialResults(pageResults);
                results.push(...pageResults)
            }
            scrapingIndex.page = 0;
            await this.saveCurrentScrapingIndex(scrapingIndex);
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

    async extractNewsPagesUrls(dateFormated, page){
        let urls = [];
        this.urlHistoric = "http://hemeroteca.lavanguardia.com/edition.html?" + dateFormated + "&ed=&em=&ey=?page=" + page;

        console.log("\n-------");
        console.log("extracting data for date:" + dateFormated + " in url:");
        console.log("-- page" + this.page + " --")
        console.log(this.urlHistoric);
        console.log("-------");
        try {
            await this.pageHistoric.goto(this.urlHistoric, {waitUntil: 'load', timeout: 0});

            const links = await this.pageHistoric.$$('a.portada');
            for (const link of links){
                const url = await (await link.getProperty('href')).jsonValue();
                urls.push(url);
            }
        } catch (err) {
            console.log(err);
        }
        await this.reopenBrowser()
        return urls;
    }

    //bd=31&bm=12&by=2018
    formatDate(date){
        const month = this.pad(2, '' + (date.getMonth() + 1));
        const  day = this.pad(2,'' + date.getDate());
        const  year = date.getFullYear();
        return `bd=${day}&bm=${month}&by=${year}`
    }
    pad(size, string) {
        while (string.length < (size || 2)) {string = "0" + string;}
        return string;
    }

    async extractFullPageNews(url, page){
        if (url) {
            console.log("extracting content of url index " + page + " url:");
            console.log(url);
            await this.pageHistoric.goto(url, {waitUntil: 'load', timeout: 0});
            await this.pageHistoric.waitFor(this.timeWaitStart);

            //await page.$eval( 'a#topbar-search', form => form.click() );
            const ocr = await this.pageHistoric.$('h3.text');
            const content = await this.extractContentFromDiv(ocr);

            this.newsCounter = this. newsCounter+1;
            if (this.newsCounter > 4 ){
                await this.reopenBrowser();
                this.newsCounter = 0;
            }
            const urlHistoric = this.urlHistoric;
            const scraper_id = this.config.scraper_id;
            const newspaper = this.config.newspaper;
            const date = this.date;
            const id = this.generateId(date);
            return {url, urlHistoric, scraper_id, newspaper, date, content, page, full_page:true, id};
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
}
