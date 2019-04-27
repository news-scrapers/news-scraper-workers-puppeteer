const ScraperDataAccess = require("./ScraperDataAccess");
const ElPaisHistoricScraper = require("./scrapers/ElPaisHistoricScraper");
const ElMundoHistoricScraper = require("./scrapers/ElMundoHistoricScraper");
const ABCHistoricScraper = require("./scrapers/ABCHistoricScraper");

const {get} = require('lodash');

const fs = require("fs");
module.exports = class ScraperApp {
    constructor() {
        require('dotenv').config();
        this.api = new ScraperDataAccess();

        this.configPath = "./config/scrapingConfig.json";
        this.config = require(this.configPath);

        if (this.config.newspaper === "elpais"){
            this.historicScaper = new ElPaisHistoricScraper();
        } else if (this.config.newspaper === "elmundo"){
            this.historicScaper = new ElMundoHistoricScraper();
        } else if (this.config.newspaper === "abc"){
            this.historicScaper = new ABCHistoricScraper();
        }
        this.maxDaysToScrap = 1000;
        this.dateOffset = (24*60*60*1000) * 1;

    }

    async startScraper() {
        await this.getCurrentScrapingIndex();
        let continueScraping = true;
        let scrapedCount = 0;

        while (continueScraping) {
            this.updateDate();
            console.log("extracting all headlines and urls")
            const scrapedNews = await this.historicScaper.scrapDate(this.scrapingIndex.date_last_new);
            if (scrapedNews){
                await scrapedNews.forEach(async (scrapedNew) => {
                    await this.api.saveNew(scrapedNew);
                });
            }
            this.scrapingIndex.date_scraped = new Date();
            this.scrapingIndex.last_historic_url = get(scrapedNews,'[0].urlHistoric');
            await this.saveCurrentScrapingIndex();

            scrapedCount = scrapedCount + 1;
            continueScraping = scrapedCount < this.maxDaysToScrap;
        }
    }

    updateDate(){
        console.log("previous date" + this.scrapingIndex.date_last_new)
        let dateToScrap = this.scrapingIndex.date_last_new;
        dateToScrap.setTime(this.scrapingIndex.date_last_new - this.dateOffset);
        this.scrapingIndex.date_last_new = dateToScrap;
        console.log("current_date" + this.scrapingIndex.date_last_new)
    }
    async getCurrentScrapingIndex(){
        this.scrapingIndex = await this.api.getScrapingIndex(this.config.scraper_id);
        console.log(this.scrapingIndex);
        if (!this.scrapingIndex || this.scrapingIndex.device_id===""){
            const currentDate = new Date();
            console.log("setting default index");
            this.scrapingIndex = {date_scraped :currentDate, date_last_new: currentDate, scraper_id: this.config.scraper_id, device_id: this.config.device_id, newspaper: this.config.newspaper}
        } else {
            this.scrapingIndex.date_last_new = new Date(this.scrapingIndex.date_last_new);
        }
        console.log(this.scrapingIndex);
    }
    async saveCurrentScrapingIndex(){
        await this.api.saveScrapingIndex(this.scrapingIndex);
    }
} 
