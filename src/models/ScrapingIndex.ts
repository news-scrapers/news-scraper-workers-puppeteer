


import mongoose from "mongoose";

export type ScrapingIndexDocument = mongoose.Document & ScrapingIndexI

const scrapingIndexSchema = new mongoose.Schema({
    date_scraping: Date,
    url_index: Number,
    page_index: Number,
    reviews_source: String,
    startingUrls: Array(String),
    scraper_id: String,
    device_id: String
}, { timestamps: true });


export interface ScrapingIndexI {
    date_scraping: Date;
    url_index: number;
    page_index: number;
    reviews_source: string;
    startingUrls: string[];
    scraper_id: string;
    device_id: string;
}


export const ScrapingConfig = mongoose.model<ScrapingIndexDocument>("ScrapingIndex", scrapingIndexSchema);

