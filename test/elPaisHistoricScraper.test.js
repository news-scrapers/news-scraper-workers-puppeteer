const chai = require('chai');
const ElPaisHistoricScraper = require("../scrapers/ElPaisHistoricScraper");

const assert = chai.assert;
require('dotenv').config();

const expect = chai.expect;
describe('App', function () {
    describe('test scraper in a given date', async function () {
        this.timeout(150000);

        const date = new Date()
        const scraper = new ElPaisHistoricScraper();

        it('scraping results shoud be not null', async function () {
            const scrapingIndex = {page:0};
            const result = await scraper.scrapDate(date, scrapingIndex);
            console.log(result);
            assert(result[0] !== undefined);
            assert(result[0].headline !== undefined);
        });
    });
});
