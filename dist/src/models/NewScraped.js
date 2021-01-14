"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNewsScrapedSqlI = exports.convertToNewsScrapedSqlI = exports.NewScrapedSql = exports.NewScraped = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sequelize_1 = require("sequelize");
const ScrapingIndex_1 = require("./ScrapingIndex");
const newScrapedSchema = new mongoose_1.default.Schema({
    newspaper: String,
    image: String,
    author: String,
    date: Date,
    scrapedAt: Date,
    content: String,
    headline: String,
    tags: Array(String),
    url: String,
    scraperId: String,
    id: String
}, { timestamps: true });
exports.NewScraped = mongoose_1.default.model("NewScraped", newScrapedSchema);
class NewScrapedSql extends sequelize_1.Model {
}
exports.NewScrapedSql = NewScrapedSql;
const convertToNewsScrapedSqlI = (newScrapedI) => {
    const newScrapedSql = newScrapedI;
    if (newScrapedSql.tags && Array.isArray(newScrapedSql.tags)) {
        const tags = newScrapedSql.tags;
        newScrapedSql.tags = tags.join(ScrapingIndex_1.joiningStr);
    }
    return newScrapedSql;
};
exports.convertToNewsScrapedSqlI = convertToNewsScrapedSqlI;
const convertNewsScrapedSqlI = (newScrapedSqlI) => {
    const index = newScrapedSqlI;
    if (newScrapedSqlI.tags.includes(ScrapingIndex_1.joiningStr)) {
        const tags = newScrapedSqlI.tags;
        index.tags = tags.split(ScrapingIndex_1.joiningStr);
    }
    return index;
};
exports.convertNewsScrapedSqlI = convertNewsScrapedSqlI;
//# sourceMappingURL=NewScraped.js.map