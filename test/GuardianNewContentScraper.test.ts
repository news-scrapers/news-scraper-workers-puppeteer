import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {CnnNewContentScraper} from "../src/scrapers/CnnNewContentScraper";
import {GuardianNewContentScraper} from "../src/scrapers/GuardianNewContentScraper";

require('dotenv').config();

describe('the guardian new scraper', function () {
    describe('test scraper in a for a given new', function () {

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new GuardianNewContentScraper("test","");
        jest.setTimeout(9999999)
        it('scraping results shoud be not null', async function () {
            const url ="https://www.theguardian.com/film/2021/jan/06/ham-on-rye-review-subversive-satire" // "https://www.thesun.co.uk/tvandshowbiz/13409249/mark-wright-found-car-stolen-essex/"
            const result = await scraper.extractNewInUrl(url);
            console.log(result);
            expect(result).toHaveProperty("content")
            expect(result).toHaveProperty("date")
            expect(result).toHaveProperty("headline")
            expect(result).toHaveProperty("description")
            expect(result).toHaveProperty("scrapedAt")
            expect(result).toHaveProperty("tags")
            expect(result.date).toBeDefined()
            expect(result.tags).toBeDefined()
            expect(result.content).toBeDefined()
            expect(result.description).not.toBeNull()
            expect(result.headline).toBeDefined()
            expect(result.url).toBeDefined()
        });
    });
});