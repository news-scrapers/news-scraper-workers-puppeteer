const chai = require('chai');
const ElPaisNewScraper = require("../scrapers/ElPaisNewContentScraper");

const assert = chai.assert;
require('dotenv').config();

const expect = chai.expect;
describe('El pais new scraper', function () {
    describe('test scraper in a for a given new', async function () {
        this.timeout(150000);

        const date = new Date()
        const scraper = new ElPaisNewScraper();

        it('scraping results shoud be not null', async function () {
            const url = "https://elpais.com/economia/2019/03/01/actualidad/1551457314_646821.html"
            const result = await scraper.extractFullNew(url);
            console.log(result);
            assert(result.content !== undefined);
        });
    });
});
