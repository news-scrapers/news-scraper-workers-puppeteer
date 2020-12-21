import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";
import {TheSunNewIndexScraper} from "../src/scrapers/TheSunNewIndexScraper";
import {ScrapingIndexI} from "../src/models/ScrapingIndex";

require('dotenv').config();

describe('the sun new scraper', function () {
    describe('test scraper in a for a given new', function () {

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://www.thesun.co.uk/tech/",
                "https://www.thesun.co.uk/travel/",
                "https://www.thesun.co.uk/tv/"]
        } as ScrapingIndexI

        const scraper = new TheSunNewIndexScraper(testIndex);
        scraper.maxPages=3
        jest.setTimeout(59999)


        it('scraping results shoud be not using index', async function () {
            testIndex.pageNewIndex = 2
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).toBeDefined()
            expect(scraper.scrapingIndex.pageNewIndex).toBe(2)
            expect(scraper.scrapingIndex.urlIndex).toBe(1)
        });

        it('scraping results shoud be not null', async function () {
            const url = "https://www.thesun.co.uk/tv"
            const result = await scraper.extractUrlsFromStartingUrl(url);
            console.log(result);
            expect(result).toBeDefined()
            expect(scraper.scrapingIndex.pageNewIndex).toBeDefined()
        });
    });
});