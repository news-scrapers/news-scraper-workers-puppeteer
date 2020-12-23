import {ScrapingIndex, ScrapingIndexDocument, ScrapingIndexI} from './models/ScrapingIndex';

import {ContentScraper} from "./scrapers/ContentScraper";
import {IndexScraper} from "./scrapers/IndexScraper";
import {TheSunNewIndexScraper} from "./scrapers/TheSunNewIndexScraper";
import {TheSunNewContentScraper} from "./scrapers/TheSunNewContentScraper";

import mongoose from 'mongoose';
import scrapingConfig from './config/scrapingConfigFull.json';
import {ScrapingConfigI} from "./models/ScrapingConfig";
import {NewScraped, NewScrapedI} from "./models/NewScraped";

require('dotenv').config();
mongoose.connect(process.env["MONGODB_URL"], {useNewUrlParser: true, useUnifiedTopology: true});

export interface ScraperTuple {
    pageScraper: ContentScraper;
    urlSectionExtractorScraper: IndexScraper;
}

export default class ScraperApp {
    public config: ScrapingConfigI = scrapingConfig as ScrapingConfigI

    public scrapers: ScraperTuple[] = [];

    public scrapingIndex: ScrapingIndexDocument;


    constructor() {
    }

    async loadIndexAndScrapers() {
        for (let newspaper of this.config.newspapers) {
            console.log("loading index for " + newspaper)

            if (newspaper === "thesunuk" || newspaper === "thesunus") {
                let indexScraper = await this.findCurrentIndex(newspaper)
                if (!indexScraper || !indexScraper.scraperId) {
                    indexScraper = this.loadIndexFromConfig(newspaper)
                }
                console.log(indexScraper)

                await this.updateIndex(indexScraper)

                const scraper = {
                    pageScraper: new TheSunNewContentScraper(),
                    urlSectionExtractorScraper: new TheSunNewIndexScraper(indexScraper)
                } as ScraperTuple
                this.scrapers.push(scraper)
            }
        }

    }

    async updateIndex(index: ScrapingIndexI) {
        index.dateScraping = new Date()
        const scrapingIndexDocument = await ScrapingIndex.findOneAndUpdate({
                scraperId: index.scraperId,
                newspaper: index.newspaper
            },
            index, {upsert: true})
    }

    async findCurrentIndex(newspaper: string): Promise<ScrapingIndexI> {
        const scrapingIndexDocument = await ScrapingIndex.findOne({
            scraperId: this.config.scraperId,
            newspaper: newspaper
        }).exec();
        if (scrapingIndexDocument) {
            return scrapingIndexDocument.toObject()
        } else return null

    }

    loadIndexFromConfig(newspaper: string): ScrapingIndexI {
        const indexScraper = {} as ScrapingIndexI
        indexScraper.urlIndex = 0
        indexScraper.startingUrls = this.config.startingUrls[newspaper]
        indexScraper.pageNewIndex = 1
        indexScraper.newspaper = newspaper
        indexScraper.scraperId = this.config.scraperId
        indexScraper.deviceId = this.config.deviceId
        indexScraper.maxPages = this.config.maxPages
        return indexScraper
    }

    async startScraper() {
        await this.loadIndexAndScrapers()
        let continueScraping = true;
        let scrapedCount = 0;

        while (continueScraping) for (let scraperTuple of this.scrapers) {
            try {
                await this.scrapOneIterationFromOneScraper(scraperTuple)
            } catch (e) {
                console.log( "----------------------------------")
                console.log("ERROR")
                console.log( "----------------------------------")
            }
        }
    }

    async scrapOneIterationFromOneScraper(scraperTuple: ScraperTuple) {
        const urls = await scraperTuple.urlSectionExtractorScraper.extractNewsUrlsInSectionPageFromIndexOneIteration()
        console.log("starting scraping urls ")
        console.log(urls)

        if (scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex >= urls.length - 1) {
            scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = 1
            await this.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex)
        }

        while (scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex <= urls.length - 1) {
            scraperTuple.urlSectionExtractorScraper.scrapingIndex = scraperTuple.urlSectionExtractorScraper.scrapingIndex

            const url = urls[scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex]
            if (url) {
                console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
                console.log("scraping url " + "page: " + scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex + " url number: " + scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex)
                console.log(url)
                console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")

                let extractedNews = await scraperTuple.pageScraper.extractNewInUrl(url, scraperTuple.urlSectionExtractorScraper.scrapingIndex.scraperId)
                await this.saveNewsScraped(extractedNews)

            }

            scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex + 1
            await this.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex)

        }

        await this.setUpNextIteration(scraperTuple)
    }
    async setUpNextIteration(scraperTuple: ScraperTuple) {
        scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex = scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex +1
        scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = 1
        scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageIndexSection = 1

        if (scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex > scraperTuple.urlSectionExtractorScraper.scrapingIndex.startingUrls.length -1 ){
            scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex = 0
        }

        await this.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex)
    }

    async saveNewsScraped(newItem: NewScrapedI) {
        const scrapingIndexDocument = await NewScraped.findOneAndUpdate({url: newItem.url},
            newItem, {upsert: true})
    }

} 