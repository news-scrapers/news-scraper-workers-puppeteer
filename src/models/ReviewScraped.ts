

import mongoose from "mongoose";

export type ReviewScrapedDocument = mongoose.Document & ReviewScrapedI

const reviewScrapedSchema = new mongoose.Schema({
    reate_text: String,
    source: String,
    user: String,
    rate: Number,
    date: String,
    content: String,
    title: String,
    tags: Array(String),
    url: String,
    scraper_id: String,
    id: String
}, { timestamps: true });




export interface ReviewScrapedI {
    reate_text: string
    source: string
    user: string
    rate: number
    date: string
    content: string
    title: string
    tags: string[]
    url: string
    scraper_id: string
    id: string
}

export const ReviewScraped = mongoose.model<ReviewScrapedDocument>("ReviewScraped", reviewScrapedSchema);
