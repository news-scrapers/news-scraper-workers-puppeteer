import {ScrapingIndex, ScrapingIndexDocument, ScrapingIndexI} from './models/ScrapingIndex';

import {ContentScraper} from "./scrapers/ContentScraper";
import {IndexScraper} from "./scrapers/IndexScraper";
import {TheSunNewIndexScraper} from "./scrapers/TheSunNewIndexScraper";
import {TheSunNewContentScraper} from "./scrapers/TheSunNewContentScraper";

import mongoose from 'mongoose';
import scrapingConfig from './config/scrapingConfigFull.json';
import {ScrapingConfigI} from "./models/ScrapingConfig";
import {NewScraped, NewScrapedI} from "./models/NewScraped";
import {BBCNewIndexScraper} from "./scrapers/BBCNewIndexScraper";
import {BBCNewContentScraper} from "./scrapers/BBCNewContentScraper";
import {CnnNewContentScraper} from "./scrapers/CnnNewContentScraper";
import {CnnNewIndexScraper} from "./scrapers/CnnNewIndexScraper";
import {GuardianNewContentScraper} from "./scrapers/GuardianNewContentScraper";
import {GuardianNewIndexScraper} from "./scrapers/GuardianNewIndexScraper";

require('dotenv').config();
mongoose.connect(process.env["MONGODB_URL"], {useNewUrlParser: true, useUnifiedTopology: true});

export interface ScraperTuple {
    pageScraper: ContentScraper;
    urlSectionExtractorScraper: IndexScraper;
}

export default class ScraperApp {
    public config: any = scrapingConfig as any

    public scrapers: ScraperTuple[] = [];

    public scrapingIndex: ScrapingIndexDocument;


    constructor() {
    }

    async loadIndexAndScrapers() {
        for (let newspaper of this.config.newspapers) {
            console.log("loading index for " + newspaper)

            if (newspaper === "guardianus") {
                const indexScraper = await this.prepareIndex(newspaper)
                const scraper = {
                    pageScraper: new GuardianNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new GuardianNewIndexScraper(indexScraper)
                } as ScraperTuple
                this.scrapers.push(scraper)
            }

            if (newspaper === "guardianuk") {
                const indexScraper = await this.prepareIndex(newspaper)
                const scraper = {
                    pageScraper: new GuardianNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new GuardianNewIndexScraper(indexScraper)
                } as ScraperTuple
                this.scrapers.push(scraper)
            }

            if (newspaper === "cnn") {
                const indexScraper = await this.prepareIndex(newspaper)
                const scraper = {
                    pageScraper: new CnnNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new CnnNewIndexScraper(indexScraper)
                } as ScraperTuple
                this.scrapers.push(scraper)
            }

            if (newspaper === "bbc") {
                const indexScraper = await this.prepareIndex(newspaper)
                const scraper = {
                    pageScraper: new BBCNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new BBCNewIndexScraper(indexScraper)
                } as ScraperTuple
                this.scrapers.push(scraper)
            }

            if (newspaper === "thesunuk" || newspaper === "thesunus") {
                const indexScraper = await this.prepareIndex(newspaper)
                const scraper = {
                    pageScraper: new TheSunNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new TheSunNewIndexScraper(indexScraper)
                } as ScraperTuple
                this.scrapers.push(scraper)
            }
        }

    }

    async prepareIndex(newspaper: string): Promise<ScrapingIndexI> {
        let indexScraper = await this.findCurrentIndex(newspaper)

        if (!indexScraper || !indexScraper.scraperId) {
            indexScraper = this.loadIndexFromConfig(newspaper)
        }
        console.log(indexScraper)

        await this.updateIndex(indexScraper)
        return indexScraper

    }

    async updateIndex(index: ScrapingIndexI) {
        try {
            index.dateScraping = new Date()
            const scrapingIndexDocument = await ScrapingIndex.findOneAndUpdate({
                    scraperId: index.scraperId,
                    newspaper: index.newspaper
                },
                index, {upsert: true})
        } catch (e) {
            console.log("ERROR UPDATING INDEX")
            throw e
        }

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
        indexScraper.startingUrls = this.config.scrapingSettings[newspaper].startingUrls
        indexScraper.pageNewIndex = 1
        indexScraper.newspaper = newspaper
        indexScraper.scraperId = this.config.scraperId
        indexScraper.deviceId = this.config.deviceId
        indexScraper.maxPages = this.config.scrapingSettings[newspaper].maxPages
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
                console.log(e)
                console.log( "----------------------------------")
            }
        }
    }

    async scrapOneIterationFromOneScraper(scraperTuple: ScraperTuple) {
        const urls = await scraperTuple.urlSectionExtractorScraper.extractNewsUrlsInSectionPageFromIndexOneIteration()
        console.log("starting scraping urls ")
        console.log(urls)

        if (scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex >= urls.length - 1) {
            console.log("RESETING_____________")
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
                console.log(extractedNews)
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
        try {
            const scrapingIndexDocument = await NewScraped.findOneAndUpdate({url: newItem.url},
                newItem, {upsert: true})
        } catch (e) {
           console.log("ERROR SAVING")
            throw e
        }

    }

} 