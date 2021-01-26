"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.scrapingIndexSqlAttributes = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dateScraping: {
        type: sequelize_1.DataTypes.DATE,
    },
    urlIndex: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    pageNewIndex: {
        type: sequelize_1.DataTypes.STRING,
    },
    pageIndexSection: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    maxPages: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    newspaper: {
        type: sequelize_1.DataTypes.STRING,
    },
    reviewsSource: {
        type: sequelize_1.DataTypes.STRING,
    },
    startingUrls: {
        type: sequelize_1.DataTypes.STRING,
    },
    scraperId: {
        type: sequelize_1.DataTypes.STRING,
    },
    deviceId: {
        type: sequelize_1.DataTypes.STRING,
    }
};
exports.joiningStrUrls = "=====";
class ScrapingIndexSql extends sequelize_1.Model {
}
exports.ScrapingIndexSql = ScrapingIndexSql;
exports.convertToScrapingIndexSqlI = (index) => {
    const indexSql = index;
    if (indexSql.startingUrls && Array.isArray(indexSql.startingUrls)) {
        const urls = indexSql.startingUrls;
        indexSql.startingUrls = urls.join(exports.joiningStrUrls);
    }
    return indexSql;
};
exports.convertScrapingIndexSqlI = (indexSql, scrapingUrls) => {
    const index = indexSql;
    const urls = scrapingUrls.map(url => url.url);
    index.startingUrls = urls;
    return index;
};
exports.obtainScrapingIUrlsSqlI = (index) => {
    return index.startingUrls.map(url => {
        const scrapingUrl = {};
        scrapingUrl.url = url;
        scrapingUrl.newspaper = index.newspaper;
        scrapingUrl.scraperId = index.scraperId;
        return scrapingUrl;
    });
};
//# sourceMappingURL=ScrapingIndexSql.js.map