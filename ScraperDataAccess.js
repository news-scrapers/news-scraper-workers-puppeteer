const fs = require('fs');
const config = require('./config/scrapingConfig.json');
const axios = require('axios');
module.exports = class ScraperDataAccess {
    constructor() {
        this.urlBase = config.urlBase;
    }
    async saveNew(newScraped) {
        const url = `${this.urlBase}/api/workers/new_scraped`;
        return axios.post(url, newScraped).then(response => response.data);
    }

    async saveScrapingIndex(scrapingIndex) {
        const url = `${this.urlBase}/api/workers/scraping_index`;
        return axios.post(url, scrapingIndex).then(response => response.data);
    }
    async getScrapingIndex(scraper_id) {
        const url = `${this.urlBase}/api/workers/scraping_index?scraper_id=${scraper_id}`;
        return axios.get(url).then(response => response.data);
    }
}
