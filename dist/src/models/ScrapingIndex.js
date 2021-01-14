"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertScrapingIndexSqlI = exports.convertToScrapingIndexSqlI = exports.ScrapingIndexSql = exports.ScrapingIndex = exports.joiningStr = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sequelize_1 = require("sequelize");
const scrapingIndexSchema = new mongoose_1.default.Schema({
    dateScraping: Date,
    urlIndex: Number,
    pageNewIndex: Number,
    pageIndexSection: Number,
    maxPages: Number,
    newspaper: String,
    reviewsSource: String,
    startingUrls: Array(String),
    scraperId: String,
    deviceId: String,
    idIndex: Number
}, { timestamps: true });
exports.joiningStr = "=====";
exports.ScrapingIndex = mongoose_1.default.model("ScrapingIndex", scrapingIndexSchema);
class ScrapingIndexSql extends sequelize_1.Model {
}
exports.ScrapingIndexSql = ScrapingIndexSql;
const convertToScrapingIndexSqlI = (index) => {
    const indexSql = index;
    if (indexSql.startingUrls && Array.isArray(indexSql.startingUrls)) {
        const urls = indexSql.startingUrls;
        indexSql.startingUrls = urls.join(exports.joiningStr);
    }
    return indexSql;
};
exports.convertToScrapingIndexSqlI = convertToScrapingIndexSqlI;
const convertScrapingIndexSqlI = (indexSql) => {
    const index = indexSql;
    if (index.startingUrls.includes(exports.joiningStr)) {
        const urls = index.startingUrls;
        index.startingUrls = urls.split(exports.joiningStr);
    }
    return index;
};
exports.convertScrapingIndexSqlI = convertScrapingIndexSqlI;
//# sourceMappingURL=ScrapingIndex.js.map