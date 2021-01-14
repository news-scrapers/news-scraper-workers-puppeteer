


import mongoose from "mongoose";
import {Model} from 'sequelize';

export type ScrapingIndexDocument = mongoose.Document & ScrapingIndexI

const scrapingIndexSchema = new mongoose.Schema({
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
    idIndex:Number

}, { timestamps: true });


export interface ScrapingIndexI {
    dateScraping: Date;
    urlIndex: number;
    pageNewIndex: number;
    pageIndexSection: number;
    maxPages: number;
    newspaper: string;
    reviewsSource: string;
    startingUrls: string[];
    scraperId: string;
    deviceId: string;
    idIndex:number;
}


export interface ScrapingIndexSqlI {
    dateScraping: Date;
    urlIndex: number;
    pageNewIndex: number;
    pageIndexSection: number;
    maxPages: number;
    newspaper: string;
    reviewsSource: string;
    startingUrls: string;
    scraperId: string;
    deviceId: string;
    idIndex:number;
}

export const joiningStr = "====="

export const ScrapingIndex = mongoose.model<ScrapingIndexDocument>("ScrapingIndex", scrapingIndexSchema);

export class ScrapingIndexSql extends Model<ScrapingIndexSqlI> {
}

export const convertToScrapingIndexSqlI = (index: ScrapingIndexI): ScrapingIndexSqlI => {
    const indexSql = index as any
    if (indexSql.startingUrls && Array.isArray(indexSql.startingUrls)){
        const urls = indexSql.startingUrls
        indexSql.startingUrls =  urls.join(joiningStr)
    }
    return indexSql as ScrapingIndexSqlI
}

export const convertScrapingIndexSqlI = (indexSql: ScrapingIndexSqlI): ScrapingIndexI => {
    const index = indexSql as any
    if (index.startingUrls.includes(joiningStr)) {
        const urls = index.startingUrls
        index.startingUrls =  urls.split(joiningStr)
    }
    return index as ScrapingIndexI
}