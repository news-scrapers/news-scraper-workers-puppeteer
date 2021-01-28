"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const globalConfigSchema = new mongoose_1.default.Schema({
    lastActive: Date,
    scraperId: String,
    lastNewspaper: String,
    deviceId: String,
    id: Number
}, { timestamps: true });
exports.GlobalConfig = mongoose_1.default.model("GlobalConfig", globalConfigSchema);
//# sourceMappingURL=GlobalConfig.js.map