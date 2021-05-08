import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {CnnNewContentScraper} from "../src/scrapers/CnnNewContentScraper";
import {NewYorkTimesContentScraper} from "../src/scrapers/NewYorkTimesContentScraper";

require('dotenv').config();

describe('Nyt scraper', function () {
    describe('test scraper in a for a given new', function () {

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new NewYorkTimesContentScraper("test","");
        jest.setTimeout(9999999)
        it('scraping results shoud be not null', async function () {
            const url ="https://www.nytimes.com/live/2021/01/27/us/biden-trump-impeachment"
            const result = await scraper.extractNewInUrl(url);
            console.log(result);
            expect(result).toHaveProperty("content")
            expect(result).toHaveProperty("date")
            expect(result).toHaveProperty("scrapedAt")
            expect(result).toHaveProperty("description")
            expect(result).toHaveProperty("tags")
            expect(result.date).toBeDefined()
            expect(result.date).not.toEqual(null)

            expect(result.tags).toBeDefined()
            expect(result.tags).not.toEqual(null)
            expect(result.content).not.toEqual(null)
            expect(result.content).not.toEqual(undefined)
            expect(result.content).not.toEqual('')
            expect(result.description).not.toEqual('')
            expect(result.description).not.toEqual(undefined)
            expect(result.description).not.toEqual(null)
            expect(result.date).not.toEqual(null)
            expect(result.headline).not.toBeNull()
            expect(result.headline).not.toBe("")
        });
    });
});