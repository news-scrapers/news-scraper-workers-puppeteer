import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";
import {TheSunNewIndexScraper} from "../src/scrapers/TheSunNewIndexScraper";
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {BBCNewIndexScraper} from "../src/scrapers/BBCNewIndexScraper";
import {CnnNewIndexScraper} from "../src/scrapers/CnnNewIndexScraper";
import {GuardianNewIndexScraper} from "../src/scrapers/GuardianNewIndexScraper";
import {UsatodayNewIndexScraper} from "../src/scrapers/UsatodayNewIndexScraper";

require('dotenv').config();

describe('the usatoday index new scraper', function () {
    describe('test index in a for a given new guardian', function () {

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://eu.usatoday.com/news/nation/",]
        } as ScrapingIndexI

        const scraper = new UsatodayNewIndexScraper(testIndex);
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