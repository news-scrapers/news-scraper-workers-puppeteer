import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";
import {TheSunNewIndexScraper} from "../src/scrapers/TheSunNewIndexScraper";
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {BBCNewIndexScraper} from "../src/scrapers/BBCNewIndexScraper";

require('dotenv').config();

describe('the bbc index new scraper', function () {
    describe('test index in a for a given new', function () {

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://www.bbc.com/news/live/entertainment-arts-47639448",
                    "https://www.bbc.com/news/live/explainers-51871385",
                    "https://www.bbc.com/news/live/world-47639450",]
        } as ScrapingIndexI

        const scraper = new BBCNewIndexScraper(testIndex);
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
        });

        it('scraping results shoud be not null', async function () {
            const url = "https://www.bbc.com/news/live/entertainment-arts-47639448"
            const result = await scraper.extractUrlsFromStartingUrl(url);
            console.log(result);
            expect(result).toBeDefined()
            expect(scraper.scrapingIndex.pageNewIndex).toBeDefined()
        });
    });
});