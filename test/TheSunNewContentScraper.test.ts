import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";

require('dotenv').config();

describe('the sun new scraper', function () {
    describe('test scraper in a for a given new', function () {

        const date = new Date()
        const scraper = new TheSunNewContentScraper();
        jest.setTimeout(59999)
        it('scraping results shoud be not null', async function () {
            const url = "https://www.thesun.co.uk/tvandshowbiz/13409249/mark-wright-found-car-stolen-essex/"
            const result = await scraper.extractReviewsInUrl(url);
            console.log(result);
            expect(result).toHaveProperty("content")
        });
    });
});