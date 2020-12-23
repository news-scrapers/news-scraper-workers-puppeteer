import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {BBCNewContentScraper} from "../src/scrapers/BBCNewContentScraper";

require('dotenv').config();

describe('the bbc new scraper', function () {
    describe('bbc test scraper in a for a given new', function () {

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new BBCNewContentScraper();
        jest.setTimeout(59999)
        it('scraping results shoud be not null', async function () {
            const url ="https://www.bbc.com/news/uk-55420193"
            const result = await scraper.extractNewInUrl(url, "test");
            console.log(result);
            expect(result).toHaveProperty("content")
            expect(result).toHaveProperty("date")
            expect(result).toHaveProperty("scrapedAt")
            expect(result).toHaveProperty("tags")
            expect(result.date).toBeDefined()
            expect(result.tags).toBeDefined()
            expect(result.content).toBeDefined()
            expect(result.headline).toBeDefined()
            expect(result.url).toBeDefined()
        });
    });
});