"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
    id: Number
}, { timestamps: true });
exports.joiningStr = "=====";
exports.ScrapingIndex = mongoose_1.default.model("ScrapingIndex", scrapingIndexSchema);
//# sourceMappingURL=ScrapingIndex.js.map