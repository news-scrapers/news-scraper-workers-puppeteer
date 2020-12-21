"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingConfig = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const scrapingConfigSchema = new mongoose_1.default.Schema({
    scraperId: String,
    appId: String,
    maxPages: Number,
    deviceId: String,
    newspapers: Array(String),
    startingUrls: Object
}, { timestamps: true });
exports.ScrapingConfig = mongoose_1.default.model("ScrapingConfig", scrapingConfigSchema);
//# sourceMappingURL=ScrapingConfig.js.map