

import mongoose from "mongoose";

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
    description:String,
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
    description: string
    tags: string[]
    url: string
    scraperId: string
    id: string
}

export const NewScraped = mongoose.model<NewScrapedDocument>("NewScraped", newScrapedSchema);
