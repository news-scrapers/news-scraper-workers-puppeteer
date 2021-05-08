import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {UsatodayNewContentScraper} from "../src/scrapers/UsatodayNewContentScraper";

require('dotenv').config();

describe('the nypost new scraper', function () {
    describe('test scraper in a for a given new', function () {

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new UsatodayNewContentScraper("","");
        jest.setTimeout(59999)
        it('scraping results shoud be not null', async function () {
            const url ="https://eu.usatoday.com/story/news/nation/2021/01/13/dc-capitol-riot-feds-say-man-texted-threats-kill-mayor-pelosi/6654896002/" // "https://www.thesun.co.uk/tvandshowbiz/13409249/mark-wright-found-car-stolen-essex/"
            const result = await scraper.extractNewInUrl(url);
            console.log(result);
            expect(result).toHaveProperty("content")
            expect(result).toHaveProperty("date")
            expect(result).toHaveProperty("scrapedAt")
            expect(result).toHaveProperty("author")
            expect(result.date).not.toBeNull()
            expect(result.author).toBeDefined()
            expect(result.content).not.toEqual("")
            expect(result.description).not.toEqual("")
            expect(result.description).not.toBeNull()
            expect(result.headline).not.toEqual("")
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