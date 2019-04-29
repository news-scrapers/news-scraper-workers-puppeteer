const chai = require('chai');
const laVanguardiaHistoricScraper = require("../scrapers/LaVanguardiaHistoricScraper");

const assert = chai.assert;
require('dotenv').config();

const expect = chai.expect;
describe('App', function () {
    describe('test scraper in a given date', async function () {
        this.timeout(150000);
        const dateOffset = (24*60*60*1000) * 36;
        const date = new Date();
        date.setTime(date - dateOffset);

        const scraper = new laVanguardiaHistoricScraper();

        it('scraping results shoud be not null', async function () {
            const result = await scraper.scrapDate(date);
            console.log(result);
            assert(result[0] !== undefined);
            assert(result[0].content !== undefined);
        });
    });
});
