

import mongoose from "mongoose";

export type ScrapingConfigDocument = mongoose.Document & ScrapingConfigI

const scrapingConfigSchema = new mongoose.Schema({
    urlBase: String,
    scraper_id: String,
    app_id: String,
    newspaper:String
}, { timestamps: true });



export interface ScrapingConfigI{
    urlBase: string;
    scraper_id: string;
    app_id: string;
    newspaper:string;
}

export const ScrapingConfig = mongoose.model<ScrapingConfigDocument>("ScrapingConfig", scrapingConfigSchema);
