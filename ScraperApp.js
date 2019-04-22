const ScraperDataAccess = require("./ScraperDataAccess");
const FotocasaBoxScraper = require("./scrapers/FotocasaBoxScraper");
const AirbnbBoxScraper = require("./scrapers/AirbnbBoxScraper");

const fs = require("fs");
module.exports = class ScraperApp {
    constructor() {
        require('dotenv').load();
        this.api = new ScraperDataAccess();

        this.configPath = "./config/scrapingConfig.json";
        this.config = require(this.configPath);

        this.somethingWasScraped = false;

    }

    async startScraper() {

    }
} 
