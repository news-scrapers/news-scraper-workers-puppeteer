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
const TheSunNewIndexScraper_1 = require("./scrapers/TheSunNewIndexScraper");
const TheSunNewContentScraper_1 = require("./scrapers/TheSunNewContentScraper");
const mongoose_1 = __importDefault(require("mongoose"));
const scrapingConfigFull_json_1 = __importDefault(require("./config/scrapingConfigFull.json"));
const BBCNewIndexScraper_1 = require("./scrapers/BBCNewIndexScraper");
const BBCNewContentScraper_1 = require("./scrapers/BBCNewContentScraper");
const CnnNewContentScraper_1 = require("./scrapers/CnnNewContentScraper");
const CnnNewIndexScraper_1 = require("./scrapers/CnnNewIndexScraper");
const GuardianNewContentScraper_1 = require("./scrapers/GuardianNewContentScraper");
const GuardianNewIndexScraper_1 = require("./scrapers/GuardianNewIndexScraper");
const UsatodayNewContentScraper_1 = require("./scrapers/UsatodayNewContentScraper");
const UsatodayNewIndexScraper_1 = require("./scrapers/UsatodayNewIndexScraper");
const sequelizeConfig_1 = require("./models/sequelizeConfig");
const PersistenceManager_1 = __importDefault(require("./PersistenceManager"));
const NewYorkTimesContentScraper_1 = require("./scrapers/NewYorkTimesContentScraper");
const NewYorkTimesIndexScraper_1 = require("./scrapers/NewYorkTimesIndexScraper");
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
            this.persistenceManager = new PersistenceManager_1.default(this.config);
            yield this.prepareGlobalConfig();
            const newspapersReordered = this.reorderNewspaperArrayStartingWithLastScraped();
            for (let newspaper of newspapersReordered) {
                console.log("loading index for " + newspaper);
                if (newspaper === "newyorktimes") {
                    const indexScraper = yield this.prepareIndex(newspaper);
                    console.log(indexScraper);
                    const scraper = {
                        pageScraper: new NewYorkTimesContentScraper_1.NewYorkTimesContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                        urlSectionExtractorScraper: new NewYorkTimesIndexScraper_1.NewYorkTimesIndexScraper(indexScraper)
                    };
                    this.scrapers.push(scraper);
                }
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
    prepareGlobalConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let globalConfig = yield this.persistenceManager.findCurrentGlogalConfig();
            if (globalConfig) {
                this.globalConfig = globalConfig;
            }
            else {
                globalConfig = {};
                globalConfig.scraperId = this.config.scraperId;
                globalConfig.deviceId = this.config.deviceId;
                globalConfig.lastNewspaper = this.config.newspapers[0];
                globalConfig.lastActive = new Date();
                this.globalConfig = globalConfig;
                yield this.persistenceManager.updateGlobalConfig(globalConfig);
            }
        });
    }
    reorderNewspaperArrayStartingWithLastScraped() {
        const currentNewspaper = this.globalConfig.lastNewspaper;
        const index = this.config.newspapers.indexOf(currentNewspaper);
        const newspapersReordered = this.config.newspapers.slice(index).concat(this.config.newspapers.slice(0, index));
        return newspapersReordered;
    }
    refreshGlobalConfigFromIndex(index) {
        return __awaiter(this, void 0, void 0, function* () {
            this.globalConfig.lastNewspaper = index.newspaper;
            this.globalConfig.lastActive = new Date();
            yield this.persistenceManager.updateGlobalConfig(this.globalConfig);
        });
    }
    prepareIndex(newspaper) {
        return __awaiter(this, void 0, void 0, function* () {
            let indexScraper = yield this.persistenceManager.findCurrentIndex(newspaper);
            if (!indexScraper || !indexScraper.scraperId) {
                console.log(indexScraper);
                indexScraper = this.loadIndexFromConfig(newspaper);
            }
            yield this.persistenceManager.updateIndex(indexScraper);
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
            yield sequelizeConfig_1.initDb();
            yield this.loadIndexAndScrapers();
            let continueScraping = true;
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
            yield this.refreshGlobalConfigFromIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex);
            const urls = yield scraperTuple.urlSectionExtractorScraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log("starting scraping urls ");
            console.log(urls);
            if (scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex >= urls.length - 1) {
                console.log("RESETING_____________");
                scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = 1;
                yield this.persistenceManager.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex);
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
                    yield this.persistenceManager.saveNewsScraped(extractedNews);
                }
                scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex + 1;
                yield this.persistenceManager.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex);
                yield this.refreshGlobalConfigFromIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex);
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
            yield this.persistenceManager.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex);
        });
    }
}
exports.default = ScraperApp;
//# sourceMappingURL=ScraperApp.js.map