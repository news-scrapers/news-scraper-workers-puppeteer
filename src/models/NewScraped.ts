

import mongoose from "mongoose";

export type NewScrapedDocument = mongoose.Document & NewScrapedI

const newScrapedSchema = new mongoose.Schema({
    source: String,
    date: String,
    content: String,
    headline: String,
    tags: Array(String),
    url: String,
    scraper_id: String,
    id: String
}, { timestamps: true });




export interface NewScrapedI {
    source: string
    date: string
    content: string
    headline: string
    tags: string[]
    url: string
    scraper_id: string
    id: string
}

export const ReviewScraped = mongoose.model<NewScrapedDocument>("NewScraped", newScrapedSchema);
