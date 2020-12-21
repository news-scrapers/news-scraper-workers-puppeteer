"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ScrapingIndex_1 = require("./models/ScrapingIndex");
const TheSunNewIndexScraper_1 = require("./scrapers/TheSunNewIndexScraper");
const TheSunNewContentScraper_1 = require("./scrapers/TheSunNewContentScraper");
const mongoose_1 = __importDefault(require("mongoose"));
const scrapingConfig_json_1 = __importDefault(require("./config/scrapingConfig.json"));
const NewScraped_1 = require("./models/NewScraped");
require('dotenv').config();
mongoose_1.default.connect(process.env["MONGODB_URL"], { useNewUrlParser: true, useUnifiedTopology: true });
class ScraperApp {
    constructor() {
        this.config = scrapingConfig_json_1.default;
        this.scrapers = [];
    }
    loadIndexAndScrapers() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let newspaper of this.config.newspapers) {
                console.log("loading index for " + newspaper);
                if (newspaper === "thesun") {
                    let indexScraper = yield this.findCurrentIndex(newspaper);
                    if (!indexScraper || !indexScraper.scraperId) {
                        indexScraper = this.loadIndexFromConfig(newspaper);
                    }
                    console.log(indexScraper);
                    yield this.updateIndex(indexScraper);
                    const scraper = {
                        pageScraper: new TheSunNewContentScraper_1.TheSunNewContentScraper(indexScraper),
                        indexScraper: new TheSunNewIndexScraper_1.TheSunNewIndexScraper(indexScraper)
                    };
                    this.scrapers.push(scraper);
                }
            }
        });
    }
    updateIndex(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const scrapingIndexDocument = yield ScrapingIndex_1.ScrapingIndex.findOneAndUpdate({
                scraperId: index.scraperId,
                newspaper: index.newspaper
            }, index, { upsert: true });
        });
    }
    findCurrentIndex(newspaper) {
        return __awaiter(this, void 0, void 0, function* () {
            const scrapingIndexDocument = yield ScrapingIndex_1.ScrapingIndex.findOne({
                scraperId: this.config.scraperId,
                newspaper: newspaper
            }).exec();
            if (scrapingIndexDocument) {
                return scrapingIndexDocument.toObject();
            }
            else
                return null;
        });
    }
    loadIndexFromConfig(newspaper) {
        const indexScraper = {};
        indexScraper.urlIndex = 0;
        indexScraper.startingUrls = this.config.startingUrls[newspaper];
        indexScraper.pageNewIndex = 1;
        indexScraper.newspaper = newspaper;
        indexScraper.scraperId = this.config.scraperId;
        indexScraper.deviceId = this.config.deviceId;
        indexScraper.maxPages = this.config.maxPages;
        return indexScraper;
    }
    startScraper() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadIndexAndScrapers();
            let continueScraping = true;
            let scrapedCount = 0;
            while (continueScraping)
                for (let scraperTuple of this.scrapers) {
                    const urls = yield scraperTuple.indexScraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
                    console.log("starting scraping urls ");
                    console.log(urls);
                    if (scraperTuple.indexScraper.scrapingIndex.pageNewIndex > urls.length - 1) {
                        scraperTuple.indexScraper.scrapingIndex.pageNewIndex = 1;
                        yield this.updateIndex(scraperTuple.pageScraper.scrapingIndex);
                    }
                    while (scraperTuple.indexScraper.scrapingIndex.pageNewIndex < urls.length - 1) {
                        scraperTuple.pageScraper.scrapingIndex = scraperTuple.indexScraper.scrapingIndex;
                        const url = urls[scraperTuple.indexScraper.scrapingIndex.pageNewIndex];
                        if (url) {
                            console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-");
                            console.log("scraping url " + "page: " + scraperTuple.pageScraper.scrapingIndex.pageNewIndex + " url number: " + scraperTuple.pageScraper.scrapingIndex.urlIndex);
                            console.log(url);
                            console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-");
                            let extractedNews = yield scraperTuple.pageScraper.extractNewInUrl(url);
                            yield this.saveNewsScraped(extractedNews);
                        }
                        scraperTuple.pageScraper.scrapingIndex.pageNewIndex = scraperTuple.pageScraper.scrapingIndex.pageNewIndex + 1;
                        yield this.updateIndex(scraperTuple.pageScraper.scrapingIndex);
                    }
                    yield this.setUpNextIteration(scraperTuple);
                }
        });
    }
    setUpNextIteration(scraperTuple) {
        return __awaiter(this, void 0, void 0, function* () {
            scraperTuple.indexScraper.scrapingIndex.urlIndex = scraperTuple.indexScraper.scrapingIndex.urlIndex + 1;
            scraperTuple.indexScraper.scrapingIndex.pageNewIndex = 1;
            if (scraperTuple.indexScraper.scrapingIndex.urlIndex > scraperTuple.indexScraper.scrapingIndex.startingUrls.length - 1) {
                scraperTuple.indexScraper.scrapingIndex.urlIndex = 0;
            }
            yield this.updateIndex(scraperTuple.indexScraper.scrapingIndex);
        });
    }
    saveNewsScraped(newItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const scrapingIndexDocument = yield NewScraped_1.NewScraped.findOneAndUpdate({ url: newItem.url }, newItem, { upsert: true });
        });
    }
}
exports.default = ScraperApp;
//# sourceMappingURL=ScraperApp.js.map