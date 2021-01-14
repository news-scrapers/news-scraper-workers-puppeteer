

import mongoose from "mongoose";
import {Model} from 'sequelize';
import {joiningStr, ScrapingIndexI, ScrapingIndexSqlI} from "./ScrapingIndex";


export type NewScrapedDocument = mongoose.Document & NewScrapedI

const newScrapedSchema = new mongoose.Schema({
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
    id: String
}, { timestamps: true });

export interface NewScrapedI {
    newspaper: string
    author: string
    image: string
    date: Date
    scrapedAt: Date
    content: string
    headline: string
    tags: string[]
    url: string
    scraperId: string
    id: string
}

export interface NewScrapedSqlI {
    newspaper: string
    author: string
    image: string
    date: Date
    scrapedAt: Date
    content: string
    headline: string
    tags: string
    url: string
    scraperId: string
    id: string
}



export const NewScraped = mongoose.model<NewScrapedDocument>("NewScraped", newScrapedSchema);


export class NewScrapedSql extends Model<NewScrapedSqlI> {
}


export const convertToNewsScrapedSqlI = (newScrapedI: NewScrapedI): NewScrapedSqlI => {
    const newScrapedSql = newScrapedI as any
    if (newScrapedSql.tags && Array.isArray(newScrapedSql.tags)){
        const tags = newScrapedSql.tags
        newScrapedSql.tags =  tags.join(joiningStr)
    }
    return newScrapedSql as NewScrapedSqlI
}

export const convertNewsScrapedSqlI = (newScrapedSqlI: NewScrapedSqlI): NewScrapedI => {
    const index = newScrapedSqlI as any
    if (newScrapedSqlI.tags.includes(joiningStr)) {
        const tags = newScrapedSqlI.tags
        index.tags =  tags.split(joiningStr)
    }
    return index as NewScrapedI
}