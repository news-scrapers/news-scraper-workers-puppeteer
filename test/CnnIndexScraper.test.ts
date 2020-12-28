import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";
import {TheSunNewIndexScraper} from "../src/scrapers/TheSunNewIndexScraper";
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {BBCNewIndexScraper} from "../src/scrapers/BBCNewIndexScraper";
import {CnnNewIndexScraper} from "../src/scrapers/CnnNewIndexScraper";

require('dotenv').config();

describe('the cnn index new scraper', function () {
    describe('test index in a for a given new cnn', function () {

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://edition.cnn.com/business/media",]
        } as ScrapingIndexI

        const scraper = new CnnNewIndexScraper(testIndex);
        scraper.maxPages=1
        jest.setTimeout(59999)


        it('scraping results shoud be not using index', async function () {
            testIndex.pageNewIndex = 2
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).toBeDefined()
            expect(scraper.scrapingIndex.pageNewIndex).toBe(2)
        });
    });
});