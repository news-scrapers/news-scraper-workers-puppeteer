import {ScrapingIndex, ScrapingIndexDocument, ScrapingIndexI} from './models/ScrapingIndex';

import {ContentScraper} from "./scrapers/ContentScraper";
import {IndexScraper} from "./scrapers/IndexScraper";
import {TheSunNewIndexScraper} from "./scrapers/TheSunNewIndexScraper";
import {TheSunNewContentScraper} from "./scrapers/TheSunNewContentScraper";

import mongoose from 'mongoose';
import scrapingConfig from './config/scrapingConfig.json';
import {ScrapingConfigI} from "./models/ScrapingConfig";
import {NewScraped, NewScrapedI} from "./models/NewScraped";

require('dotenv').config();
mongoose.connect(process.env["MONGODB_URL"], {useNewUrlParser: true, useUnifiedTopology: true});

export interface ScraperTuple {
    pageScraper: ContentScraper;
    indexScraper: IndexScraper;
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

            if (newspaper === "thesun") {
                let indexScraper = await this.findCurrentIndex(newspaper)
                if (!indexScraper || !indexScraper.scraperId) {
                    indexScraper = this.loadIndexFromConfig(newspaper)
                }
                console.log(indexScraper)

                await this.updateIndex(indexScraper)

                const scraper = {
                    pageScraper: new TheSunNewContentScraper(indexScraper),
                    indexScraper: new TheSunNewIndexScraper(indexScraper)
                } as ScraperTuple
                this.scrapers.push(scraper)
            }
        }

    }

    async updateIndex(index: ScrapingIndexI) {
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
        indexScraper.pageIndex = 1
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

        while (continueScraping) {
            for (let scraperTuple of this.scrapers) {
                const urls = await scraperTuple.indexScraper.extractNewsUrlsInSectionPageFromIndexOneIteration()
                console.log("starting scraping urls ")
                console.log(urls)

                for (let page = scraperTuple.indexScraper.scrapingIndex.pageIndex; page++; page < urls.length - 1) {
                    scraperTuple.pageScraper.scrapingIndex = scraperTuple.indexScraper.scrapingIndex
                    const url = urls[page]

                    console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
                    console.log("scraping url")
                    console.log(url)
                    console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")

                    let extractedNews = await scraperTuple.pageScraper.extractNewInUrl(url)
                    await this.saveNewsScraped(extractedNews)
                    await this.updateIndex(scraperTuple.pageScraper.scrapingIndex)
                    console.log(extractedNews)

                }
                await this.updateIndex(scraperTuple.indexScraper.scrapingIndex)
            }
        }
    }

    async saveNewsScraped(newItem: NewScrapedI) {
        const scrapingIndexDocument = await NewScraped.findOneAndUpdate({url: newItem.url},
            newItem, {upsert: true})
    }

} 