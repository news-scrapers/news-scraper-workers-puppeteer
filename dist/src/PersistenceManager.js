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
const mongoose_1 = __importDefault(require("mongoose"));
const ScrapingIndexSql_1 = require("./models/ScrapingIndexSql");
const NewScrapedSql_1 = require("./models/NewScrapedSql");
const NewScraped_1 = require("./models/NewScraped");
const ScrapingUrlSql_1 = require("./models/ScrapingUrlSql");
const GlobalConfigSql_1 = require("./models/GlobalConfigSql");
const GlobalConfig_1 = require("./models/GlobalConfig");
require('dotenv').config();
mongoose_1.default.connect(process.env["MONGODB_URL"], { useNewUrlParser: true, useUnifiedTopology: true });
class PersistenceManager {
    constructor(config) {
        this.config = {};
        this.config = config;
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
                    const indexSql = ScrapingIndexSql_1.convertToScrapingIndexSqlI(indexDb);
                    const startingUrlsSql = ScrapingIndexSql_1.obtainScrapingIUrlsSqlI(index);
                    const found = yield ScrapingIndexSql_1.ScrapingIndexSql.findOne({ where: conditions });
                    if (found) {
                        yield ScrapingIndexSql_1.ScrapingIndexSql.update(indexSql, { where: conditions });
                    }
                    else {
                        yield ScrapingIndexSql_1.ScrapingIndexSql.create(indexSql);
                        for (const url of startingUrlsSql) {
                            const foundUrl = yield ScrapingUrlSql_1.ScrapingUrlsSql.findOne({ where: { url: url.url, newspaper: url.newspaper } });
                            if (!foundUrl) {
                                yield ScrapingUrlSql_1.ScrapingUrlsSql.create(url);
                            }
                        }
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
            let index;
            const conditions = {
                scraperId: this.config.scraperId,
                newspaper: newspaper
            };
            if (this.config.useSqliteDb) {
                try {
                    const startingUrlsSql = yield ScrapingUrlSql_1.ScrapingUrlsSql.findAll({ where: conditions });
                    const scrapingIndexDocumentM = yield ScrapingIndexSql_1.ScrapingIndexSql.findOne({ where: conditions });
                    if (scrapingIndexDocumentM && startingUrlsSql) {
                        const startingUrls = startingUrlsSql.map(item => item.toJSON());
                        index = ScrapingIndexSql_1.convertScrapingIndexSqlI(scrapingIndexDocumentM.toJSON(), startingUrls);
                    }
                    else {
                        index = null;
                    }
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
                        index = scrapingIndexDocument.toObject();
                    }
                    else {
                        index = null;
                    }
                }
                catch (e) {
                    console.log("error saving using mongodb");
                    throw e;
                }
            }
            return index;
        });
    }
    findCurrentGlogalConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let globalConfig;
            const conditions = {
                scraperId: this.config.scraperId,
            };
            if (this.config.useSqliteDb) {
                try {
                    const globalConfigSql = yield GlobalConfigSql_1.GlobalConfigSql.findOne({ where: conditions });
                    if (globalConfigSql) {
                        globalConfig = globalConfigSql.toJSON();
                    }
                    else {
                        globalConfig = null;
                    }
                }
                catch (e) {
                    console.log("error saving global config using sqlite");
                    throw e;
                }
            }
            if (this.config.useMongoDb) {
                try {
                    let globalConfgMongo = yield GlobalConfig_1.GlobalConfig.findOne(conditions).exec();
                    if (globalConfgMongo) {
                        globalConfig = globalConfgMongo.toObject();
                    }
                    else {
                        globalConfig = null;
                    }
                }
                catch (e) {
                    console.log("error saving using mongodb");
                    throw e;
                }
            }
            return globalConfig;
        });
    }
    updateGlobalConfig(globalConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = {
                scraperId: this.config.scraperId,
            };
            if (this.config.useSqliteDb) {
                const found = yield GlobalConfigSql_1.GlobalConfigSql.findOne({ where: conditions });
                if (found) {
                    yield GlobalConfigSql_1.GlobalConfigSql.update(globalConfig, { where: conditions });
                }
                else {
                    yield GlobalConfigSql_1.GlobalConfigSql.create(globalConfig);
                }
            }
            if (this.config.useMongoDb) {
                try {
                    yield GlobalConfig_1.GlobalConfig.findOneAndUpdate(conditions, globalConfig, { upsert: true });
                }
                catch (e) {
                    console.log("ERROR SAVING mongo");
                    throw e;
                }
            }
        });
    }
    saveNewsScraped(newItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = { url: newItem.url };
            if (this.config.useSqliteDb && newItem.url) {
                newItem = this.cleanUpForSaving(newItem);
                try {
                    const newsSql = NewScrapedSql_1.convertToNewsScrapedSqlI(newItem);
                    const found = yield NewScrapedSql_1.NewScrapedSql.findOne({ where: conditions });
                    if (found) {
                        yield NewScrapedSql_1.NewScrapedSql.update(newsSql, { where: conditions });
                    }
                    else {
                        yield NewScrapedSql_1.NewScrapedSql.create(newsSql);
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
    cleanUpForSaving(newItem) {
        if (!newItem.id || newItem.id == null)
            newItem.id = "error";
        if (!newItem.url || newItem.url == null)
            newItem.url = "";
        return newItem;
    }
}
exports.default = PersistenceManager;
//# sourceMappingURL=PersistenceManager.js.map