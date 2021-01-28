"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewScrapedSchema = new mongoose_1.default.Schema({
    reate_text: String,
    source: String,
    user: String,
    rate: Number,
    date: String,
    content: String,
    title: String,
    tags: Array(String),
    url: String,
    scraper_id: String,
    id: String
}, { timestamps: true });
exports.ReviewScraped = mongoose_1.default.model("ReviewScraped", reviewScrapedSchema);
//# sourceMappingURL=ReviewScraped.js.map