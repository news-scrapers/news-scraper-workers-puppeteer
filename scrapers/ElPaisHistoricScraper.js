const PuppeteerScraper = require('./PuppeteerScraper');

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
        const url = "https://elpais.com/tag/fecha/" + dateFormated + "/3";

        console.log("\n---");
        console.log("extracting data for date:" + dateFormated + " in url:")
        console.log(url);
        console.log("---");

        await this.initializePuppeteer();

        try {
            await this.page.goto(url);
            await this.page.waitFor(this.timeWaitStart);

            let results = []
            const divs = await this.page.$$('div.articulo__interior');
            for (const div of divs){
                const newScrapedHeadline = await this.extractHeadLineAndUrl(div)
                results.push(newScrapedHeadline);
            }
            return results;

        } catch (err) {
            console.log(err);
            await this.page.screenshot({ path: 'example.png' });
            await this.browser.close();
            return null;
        }
    }

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

    async extractHeadLineAndUrl(div){
        // articulo-titulo
        const h2Headline = await div.$('h2');
        const aHeadline = await div.$('a');
        const headline = await (await h2Headline.getProperty('textContent')).jsonValue();
        const url = await (await aHeadline.getProperty('href')).jsonValue();

        return {headline, url}
        console.log(href)

    }
}
