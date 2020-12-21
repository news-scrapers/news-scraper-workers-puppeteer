import {TheSunNewContentScraper} from "../src/scrapers/TheSunNewContentScraper";
import {TheSunNewIndexScraper} from "../src/scrapers/TheSunNewIndexScraper";
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import ScraperApp from "../src/ScraperApp";

require('dotenv').config();

describe('main scraper app', function () {
    describe('load database index', function () {

        it('load the db index', async function () {
            const scraperApp = new ScraperApp()
            await scraperApp.loadIndexAndScrapers()
        });
    });

    describe('attempt full scraping index', function () {

        it('attempt full scraping', async function () {
            jest.setTimeout(59999)

            const scraperApp = new ScraperApp()
            await scraperApp.loadIndexAndScrapers()
            await scraperApp.startScraper()
        });
    });
});