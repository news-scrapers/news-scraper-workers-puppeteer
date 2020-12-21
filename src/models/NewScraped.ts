

import mongoose from "mongoose";

export type NewScrapedDocument = mongoose.Document & NewScrapedI

const newScrapedSchema = new mongoose.Schema({
    source: String,
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
    source: string
    date: Date
    scrapedAt: Date
    content: string
    headline: string
    tags: string[]
    url: string
    scraperId: string
    id: string
}

export const ReviewScraped = mongoose.model<NewScrapedDocument>("NewScraped", newScrapedSchema);
