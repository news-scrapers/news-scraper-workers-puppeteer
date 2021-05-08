import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";
import {ScrapingIndexI} from "../src/models/ScrapingIndex";

require('dotenv').config();

describe('the sun new scraper', function () {
    describe('test scraper in a for a given new', function () {

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new TheSunNewContentScraper("test", "");
        jest.setTimeout(59999)
        it('scraping results shoud be not null', async function () {
            const url ="https://www.thesun.co.uk/tv/13526075/strictly-jamie-laing-sister-giovanni-pernice-number/" // "https://www.thesun.co.uk/tvandshowbiz/13409249/mark-wright-found-car-stolen-essex/"
            const result = await scraper.extractNewInUrl(url);
            console.log(result);
            expect(result).toHaveProperty("content")
            expect(result).toHaveProperty("date")
            expect(result).toHaveProperty("scrapedAt")
            expect(result).toHaveProperty("description")
            expect(result).toHaveProperty("tags")
            expect(result.date).toBeDefined()
            expect(result.tags).toBeDefined()
            expect(result.content).toBeDefined()
            expect(result.image).not.toBeNull()
            expect(result.image).not.toBe("")
            expect(result.headline).toBeDefined()
            expect(result.url).toBeDefined()

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