"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
    description: String,
    id: String
}, { timestamps: true });
exports.NewScraped = mongoose_1.default.model("NewScraped", newScrapedSchema);
//# sourceMappingURL=NewScraped.js.map