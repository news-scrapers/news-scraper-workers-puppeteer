import {ElPaisNewContentScraper} from './scrapers/ElPaisNewContentScraper'
import { ScrapingIndexDocument } from './models/ScrapingIndex';
import { ReviewScrapedDocument } from './models/ReviewScraped';

const {get} = require('lodash');

const fs = require("fs");

export default class ScraperApp {
    public config: any;
    public scraper: any;
    public scrapingIndex: ScrapingIndexDocument;
    constructor() {
        require('dotenv').config();
        //this.api = new ScraperDataAccess();

        if (this.config.newspaper === "elpais"){
            this.scraper = new ElPaisNewContentScraper();
        }
        
    
    }

    async startScraper() {
        await this.getCurrentScrapingIndex();
        let continueScraping = true;
        let scrapedCount = 0;

        while (continueScraping) {
            console.log("extracting all headlines and urls")
            try{
                
                await this.saveCurrentScrapingIndex();
            } catch (err) {
                console.log(err);
                await this.saveCurrentScrapingIndex();
            }
            
            this.updateDate();
        }
    }

    updateDate(){
       
    }
    async getCurrentScrapingIndex(){
        
    }
    async saveCurrentScrapingIndex(){
       
    }
} 