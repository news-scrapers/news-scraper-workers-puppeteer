"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingIndex = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const scrapingIndexSchema = new mongoose_1.default.Schema({
    date_scraping: Date,
    urlIndex: Number,
    pageIndex: Number,
    maxPages: Number,
    newspaper: String,
    reviewsSource: String,
    startingUrls: Array(String),
    scraperId: String,
    deviceId: String
}, { timestamps: true });
exports.ScrapingIndex = mongoose_1.default.model("ScrapingIndex", scrapingIndexSchema);
//# sourceMappingURL=ScrapingIndex.js.map