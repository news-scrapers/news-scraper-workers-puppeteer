const chai = require('chai');
const ABCHistoricScraper = require("../scrapers/ABCHistoricScraper");

const assert = chai.assert;
require('dotenv').config();

const expect = chai.expect;
describe('App', function () {
    describe('test scraper in a given date', async function () {
        this.timeout(150000);
        const dateOffset = (24*60*60*1000) * 16;
        const date = new Date();
        date.setTime(date - dateOffset)
        const scraper = new ABCHistoricScraper();

        it('scraping results shoud be not null', async function () {
            const scrapingIndex = {page:0};
            const result = await scraper.scrapDate(date, scrapingIndex);
            console.log(result);
            assert(result[0] !== undefined);
            assert(result[0].content !== undefined);
            assert(result[0].page !== undefined);
        });
    });
});
