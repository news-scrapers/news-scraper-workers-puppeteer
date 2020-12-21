
import {PuppeteerScraper} from "./PuppeteerScraper";
import {NewScrapedI} from "../models/NewScraped";
import {ScrapingIndexI} from "../models/ScrapingIndex";

export class ContentScraper extends PuppeteerScraper {
    public scrapingIndex: ScrapingIndexI

    async extractNewInUrl(url: string):Promise<NewScrapedI> {
        return {} as NewScrapedI
    }
}