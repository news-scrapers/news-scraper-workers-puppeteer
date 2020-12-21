

import mongoose from "mongoose";

export type ScrapingConfigDocument = mongoose.Document & ScrapingConfigI

const scrapingConfigSchema = new mongoose.Schema({
    urlBase: String,
    scraperId: String,
    appId: String,
    newspaper:String
}, { timestamps: true });



export interface ScrapingConfigI{
    urlBase: string;
    scraperId: string;
    appId: string;
    newspaper:string;
}

export const ScrapingConfig = mongoose.model<ScrapingConfigDocument>("ScrapingConfig", scrapingConfigSchema);
