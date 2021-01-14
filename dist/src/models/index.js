"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const NewScraped_1 = require("./NewScraped");
const ScrapingIndex_1 = require("./ScrapingIndex");
const sequelize_2 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize({
    storage: './database.sqlite3',
    dialect: 'sqlite',
});
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    NewScraped_1.NewScrapedSql.init({
        id: {
            type: sequelize_2.DataTypes.STRING,
            primaryKey: true
        },
        newspaper: {
            type: sequelize_2.DataTypes.STRING,
        },
        author: {
            type: sequelize_2.DataTypes.STRING,
        },
        image: {
            type: sequelize_2.DataTypes.STRING,
        },
        date: {
            type: sequelize_2.DataTypes.DATE,
        },
        scrapedAt: {
            type: sequelize_2.DataTypes.DATE,
        },
        content: {
            type: sequelize_2.DataTypes.STRING,
        },
        headline: {
            type: sequelize_2.DataTypes.STRING,
        },
        tags: {
            type: sequelize_2.DataTypes.STRING,
        },
        url: {
            type: sequelize_2.DataTypes.STRING,
        },
        scraperId: {
            type: sequelize_2.DataTypes.STRING,
        }
    }, {
        tableName: "NewScrapedSql",
        sequelize: exports.sequelize,
    });
    ScrapingIndex_1.ScrapingIndexSql.init({
        idIndex: {
            type: sequelize_2.DataTypes.NUMBER,
        },
        dateScraping: {
            type: sequelize_2.DataTypes.DATE,
        },
        urlIndex: {
            type: sequelize_2.DataTypes.NUMBER,
        },
        pageNewIndex: {
            type: sequelize_2.DataTypes.STRING,
        },
        pageIndexSection: {
            type: sequelize_2.DataTypes.NUMBER,
        },
        maxPages: {
            type: sequelize_2.DataTypes.NUMBER,
        },
        newspaper: {
            type: sequelize_2.DataTypes.STRING,
        },
        reviewsSource: {
            type: sequelize_2.DataTypes.STRING,
        },
        startingUrls: {
            type: sequelize_2.DataTypes.STRING,
        },
        scraperId: {
            type: sequelize_2.DataTypes.STRING,
        },
        deviceId: {
            type: sequelize_2.DataTypes.STRING,
        }
    }, {
        tableName: "ScrapingIndexSql",
        sequelize: exports.sequelize,
    });
    yield NewScraped_1.NewScrapedSql.sync({ force: false });
    yield ScrapingIndex_1.ScrapingIndexSql.sync({ force: false });
});
exports.initDb = initDb;
//# sourceMappingURL=index.js.map