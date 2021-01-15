

import mongoose from "mongoose";

export type GlobalConfigDocument = mongoose.Document & GlobalConfigI

const globalConfigSchema = new mongoose.Schema({
    lastActive: Date,
    scraperId: String,
    lastNewspaper: String,
    deviceId: String,
    id: Number
}, { timestamps: true });

export interface GlobalConfigI {
    lastActive: Date;
    scraperId: string;
    lastNewspaper: string;
    deviceId: string;
    id: number;
}

export const GlobalConfig = mongoose.model<GlobalConfigDocument>("GlobalConfig", globalConfigSchema);
