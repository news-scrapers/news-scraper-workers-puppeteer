const fs = require('fs');
const mysql = require('mysql');
const config = require('./config/scrapingConfig.json');
const axios = require('axios');
const get = require('lodash').get;
module.exports = class ScraperDataAccess {
    constructor() {
        this.urlBase = config.urlBase;
    }
    async saveExecutionLog(newScraped) {
        const url = `${this.urlBase}/api/workers/new_scraped`;
        return axios.put(url, newScraped).then(response => response.data);
    }
}
