


import mongoose from "mongoose";

export type ScrapingIndexDocument = mongoose.Document & ScrapingIndexI

const scrapingIndexSchema = new mongoose.Schema({
    date_scraping: Date,
    urlIndex: Number,
    pageIndex: Number,
    reviewsSource: String,
    startingUrls: Array(String),
    scraperId: String,
    deviceId: String
}, { timestamps: true });


export interface ScrapingIndexI {
    dateScraping: Date;
    urlIndex: number;
    pageIndex: number;
    reviewsSource: string;
    startingUrls: string[];
    scraperId: string;
    deviceId: string;
}


export const ScrapingConfig = mongoose.model<ScrapingIndexDocument>("ScrapingIndex", scrapingIndexSchema);

