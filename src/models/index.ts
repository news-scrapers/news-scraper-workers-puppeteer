import {Sequelize} from 'sequelize';
import {NewScrapedSql} from "./NewScraped";
import {ScrapingIndexSql} from "./ScrapingIndex";
import {DataTypes} from "sequelize";
import path from "path";

export const sequelize =  new Sequelize({
    storage: './database.sqlite3',
    dialect: 'sqlite',
});

export const initDb = async () => {
    NewScrapedSql.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            newspaper: {
                type: DataTypes.STRING,
            },
            author: {
                type: DataTypes.STRING,
            },
            image: {
                type: DataTypes.STRING,
            },
            date: {
                type: DataTypes.DATE,
            },
            scrapedAt: {
                type: DataTypes.DATE,
            },
            content: {
                type: DataTypes.STRING,
            },
            headline: {
                type: DataTypes.STRING,
            },
            tags:{
                type: DataTypes.STRING,
            },
            url: {
                type: DataTypes.STRING,
            },
            scraperId: {
                type: DataTypes.STRING,
            }
        },
        {
            tableName: "NewScrapedSql",
            sequelize: sequelize, // this bit is important
        }
    );

    ScrapingIndexSql.init(
        {
            idIndex: {
                type: DataTypes.NUMBER,
            },
            dateScraping: {
                type: DataTypes.DATE,
            },
            urlIndex: {
                type: DataTypes.NUMBER,
            },
            pageNewIndex: {
                type: DataTypes.STRING,
            },
            pageIndexSection: {
                type: DataTypes.NUMBER,
            },
            maxPages: {
                type: DataTypes.NUMBER,
            },
            newspaper: {
                type: DataTypes.STRING,
            },
            reviewsSource: {
                type: DataTypes.STRING,
            },
            startingUrls: {
                type: DataTypes.STRING,
            },
            scraperId: {
                type: DataTypes.STRING,
            },
            deviceId: {
                type: DataTypes.STRING,
            }
        },
        {
            tableName: "ScrapingIndexSql",
            sequelize: sequelize, // this bit is important
        }
    );

    await NewScrapedSql.sync({force: false})
    await ScrapingIndexSql.sync({force: false})
}
