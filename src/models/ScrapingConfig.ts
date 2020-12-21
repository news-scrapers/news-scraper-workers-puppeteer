

import mongoose from "mongoose";

export type ScrapingConfigDocument = mongoose.Document & ScrapingConfigI

const scrapingConfigSchema = new mongoose.Schema({
    scraperId: String,
    appId: String,
    maxPages: Number,
    deviceId:String,
    newspapers: Array(String),
    startingUrls: Object
}, { timestamps: true });



export interface ScrapingConfigI{
    scraperId: string;
    appId: string;
    maxPages: number;
    deviceId:string;
    newspapers:string[];
    startingUrls: any;

}

export const ScrapingConfig = mongoose.model<ScrapingConfigDocument>("ScrapingConfig", scrapingConfigSchema);
