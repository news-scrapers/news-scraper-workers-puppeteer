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
const scrapingConfigFull_json_1 = __importDefault(require("./config/scrapingConfigFull.json"));
const NewScraped_1 = require("./models/NewScraped");
const BBCNewIndexScraper_1 = require("./scrapers/BBCNewIndexScraper");
const BBCNewContentScraper_1 = require("./scrapers/BBCNewContentScraper");
const CnnNewContentScraper_1 = require("./scrapers/CnnNewContentScraper");
const CnnNewIndexScraper_1 = require("./scrapers/CnnNewIndexScraper");
const GuardianNewContentScraper_1 = require("./scrapers/GuardianNewContentScraper");
const GuardianNewIndexScraper_1 = require("./scrapers/GuardianNewIndexScraper");
const UsatodayNewContentScraper_1 = require("./scrapers/UsatodayNewContentScraper");
const UsatodayNewIndexScraper_1 = require("./scrapers/UsatodayNewIndexScraper");
const models_1 = require("./models");
require('dotenv').config();
mongoose_1.default.connect(process.env["MONGODB_URL"], { useNewUrlParser: true, useUnifiedTopology: true });
class ScraperApp {
    constructor() {
        this.config = scrapingConfigFull_json_1.default;
        this.scrapers = [];
        this.joiningStr = "====";
    }
    loadIndexAndScrapers() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let newspaper of this.config.newspapers) {
                console.log("loading index for " + newspaper);
                if (newspaper === "guardianus") {
                    const indexScraper = yield this.prepareIndex(newspaper);
                    console.log(indexScraper);
                    const scraper = {
                        pageScraper: new GuardianNewContentScraper_1.GuardianNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                        urlSectionExtractorScraper: new GuardianNewIndexScraper_1.GuardianNewIndexScraper(indexScraper)
                    };
                    this.scrapers.push(scraper);
                }
                if (newspaper === "usatoday") {
                    const indexScraper = yield this.prepareIndex(newspaper);
                    const scraper = {
                        pageScraper: new UsatodayNewContentScraper_1.UsatodayNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                        urlSectionExtractorScraper: new UsatodayNewIndexScraper_1.UsatodayNewIndexScraper(indexScraper)
                    };
                    this.scrapers.push(scraper);
                }
                if (newspaper === "guardianuk") {
                    const indexScraper = yield this.prepareIndex(newspaper);
                    const scraper = {
                        pageScraper: new GuardianNewContentScraper_1.GuardianNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                        urlSectionExtractorScraper: new GuardianNewIndexScraper_1.GuardianNewIndexScraper(indexScraper)
                    };
                    this.scrapers.push(scraper);
                }
                if (newspaper === "cnn") {
                    const indexScraper = yield this.prepareIndex(newspaper);
                    const scraper = {
                        pageScraper: new CnnNewContentScraper_1.CnnNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                        urlSectionExtractorScraper: new CnnNewIndexScraper_1.CnnNewIndexScraper(indexScraper)
                    };
                    this.scrapers.push(scraper);
                }
                if (newspaper === "bbc") {
                    const indexScraper = yield this.prepareIndex(newspaper);
                    const scraper = {
                        pageScraper: new BBCNewContentScraper_1.BBCNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                        urlSectionExtractorScraper: new BBCNewIndexScraper_1.BBCNewIndexScraper(indexScraper)
                    };
                    this.scrapers.push(scraper);
                }
                if (newspaper === "thesunuk" || newspaper === "thesunus") {
                    const indexScraper = yield this.prepareIndex(newspaper);
                    const scraper = {
                        pageScraper: new TheSunNewContentScraper_1.TheSunNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                        urlSectionExtractorScraper: new TheSunNewIndexScraper_1.TheSunNewIndexScraper(indexScraper)
                    };
                    this.scrapers.push(scraper);
                }
            }
        });
    }
    prepareIndex(newspaper) {
        return __awaiter(this, void 0, void 0, function* () {
            let indexScraper = yield this.findCurrentIndex(newspaper);
            if (!indexScraper || !indexScraper.scraperId) {
                console.log(indexScraper);
                indexScraper = this.loadIndexFromConfig(newspaper);
            }
            yield this.updateIndex(indexScraper);
            return indexScraper;
        });
    }
    loadIndexFromConfig(newspaper) {
        console.log("@---------------------------------------@");
        console.log("loading from config");
        console.log("@---------------------------------------@");
        const indexScraper = {};
        indexScraper.urlIndex = 0;
        indexScraper.startingUrls = this.config.scrapingSettings[newspaper].startingUrls;
        indexScraper.pageNewIndex = 1;
        indexScraper.newspaper = newspaper;
        indexScraper.scraperId = this.config.scraperId;
        indexScraper.deviceId = this.config.deviceId;
        indexScraper.maxPages = this.config.scrapingSettings[newspaper].maxPages;
        return indexScraper;
    }
    startScraper() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.initDb();
            yield this.loadIndexAndScrapers();
            let continueScraping = true;
            let scrapedCount = 0;
            while (continueScraping)
                for (let scraperTuple of this.scrapers) {
                    try {
                        yield this.scrapOneIterationFromOneScraper(scraperTuple);
                    }
                    catch (e) {
                        console.log("----------------------------------");
                        console.log("ERROR");
                        console.log(e);
                        console.log("----------------------------------");
                    }
                }
        });
    }
    scrapOneIterationFromOneScraper(scraperTuple) {
        return __awaiter(this, void 0, void 0, function* () {
            const urls = yield scraperTuple.urlSectionExtractorScraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log("starting scraping urls ");
            console.log(urls);
            if (scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex >= urls.length - 1) {
                console.log("RESETING_____________");
                scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = 1;
                yield this.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex);
            }
            while (scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex <= urls.length - 1) {
                scraperTuple.urlSectionExtractorScraper.scrapingIndex = scraperTuple.urlSectionExtractorScraper.scrapingIndex;
                const url = urls[scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex];
                if (url) {
                    console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-");
                    console.log("scraping url " + "page: " + scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex + " url number: " + scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex);
                    console.log(url);
                    console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-");
                    let extractedNews = yield scraperTuple.pageScraper.extractNewInUrl(url, scraperTuple.urlSectionExtractorScraper.scrapingIndex.scraperId);
                    console.log(extractedNews);
                    yield this.saveNewsScraped(extractedNews);
                }
                scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex + 1;
                yield this.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex);
            }
            yield this.setUpNextIteration(scraperTuple);
        });
    }
    setUpNextIteration(scraperTuple) {
        return __awaiter(this, void 0, void 0, function* () {
            scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex = scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex + 1;
            scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = 1;
            scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageIndexSection = 1;
            if (scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex > scraperTuple.urlSectionExtractorScraper.scrapingIndex.startingUrls.length - 1) {
                scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex = 0;
            }
            yield this.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex);
        });
    }
    updateIndex(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const indexDb = Object.create(index);
            const conditions = {
                scraperId: indexDb.scraperId,
                newspaper: indexDb.newspaper
            };
            indexDb.dateScraping = new Date();
            if (this.config.useMongoDb) {
                try {
                    yield ScrapingIndex_1.ScrapingIndex.findOneAndUpdate(conditions, indexDb, { upsert: true });
                }
                catch (e) {
                    console.log("ERROR UPDATING INDEX mongo");
                    throw e;
                }
            }
            if (this.config.useSqliteDb) {
                try {
                    const indexSql = ScrapingIndex_1.convertToScrapingIndexSqlI(indexDb);
                    const found = yield ScrapingIndex_1.ScrapingIndexSql.findOne({ where: conditions });
                    if (found) {
                        yield ScrapingIndex_1.ScrapingIndexSql.update(indexSql, { where: conditions });
                    }
                    else {
                        yield ScrapingIndex_1.ScrapingIndexSql.create(indexSql);
                    }
                }
                catch (e) {
                    console.log("ERROR UPDATING INDEX sqlite");
                    throw e;
                }
            }
        });
    }
    findCurrentIndex(newspaper) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = {
                //scraperId: this.config.scraperId,
                newspaper: newspaper
            };
            if (this.config.useSqliteDb) {
                try {
                    const scrapingIndexDocumentM = yield ScrapingIndex_1.ScrapingIndexSql.findOne({ where: conditions });
                    if (scrapingIndexDocumentM) {
                        const index = ScrapingIndex_1.convertScrapingIndexSqlI(scrapingIndexDocumentM.toJSON());
                        return index;
                    }
                    return null;
                }
                catch (e) {
                    console.log("error saving using sqlite");
                    throw e;
                }
            }
            if (this.config.useMongoDb) {
                try {
                    let scrapingIndexDocument = yield ScrapingIndex_1.ScrapingIndex.findOne(conditions).exec();
                    if (scrapingIndexDocument) {
                        return scrapingIndexDocument.toObject();
                    }
                    else
                        return null;
                }
                catch (e) {
                    console.log("error saving using mongodb");
                    throw e;
                }
            }
        });
    }
    saveNewsScraped(newItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = { url: newItem.url };
            if (this.config.useSqliteDb) {
                try {
                    const newsSql = NewScraped_1.convertToNewsScrapedSqlI(newItem);
                    const found = yield NewScraped_1.NewScrapedSql.findOne({ where: conditions });
                    if (found) {
                        yield NewScraped_1.NewScrapedSql.update(newsSql, { where: conditions });
                    }
                    else {
                        yield NewScraped_1.NewScrapedSql.create(newsSql);
                    }
                }
                catch (e) {
                    console.log("ERROR SAVING sqlite");
                    throw e;
                }
            }
            if (this.config.useMongoDb) {
                try {
                    const scrapingIndexDocument = yield NewScraped_1.NewScraped.findOneAndUpdate(conditions, newItem, { upsert: true });
                }
                catch (e) {
                    console.log("ERROR SAVING mongo");
                    throw e;
                }
            }
        });
    }
}
exports.default = ScraperApp;
//# sourceMappingURL=ScraperApp.js.map