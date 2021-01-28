import {
    ScrapingIndex,
    ScrapingIndexI,
} from './models/ScrapingIndex';

import mongoose from 'mongoose';
import {ScrapingConfigI} from "./models/ScrapingConfig";
import {
    convertScrapingIndexSqlI,
    convertToScrapingIndexSqlI, obtainScrapingIUrlsSqlI,
    ScrapingIndexSql,
    ScrapingIndexSqlI
} from "./models/ScrapingIndexSql";
import {convertToNewsScrapedSqlI, NewScrapedSql} from "./models/NewScrapedSql";
import {NewScraped, NewScrapedI} from "./models/NewScraped";
import {ScrapingUrlsSql, ScrapingUrlsSqlI} from "./models/ScrapingUrlSql";
import {GlobalConfigSql} from "./models/GlobalConfigSql";
import {GlobalConfig, GlobalConfigI} from "./models/GlobalConfig";

require('dotenv').config();
mongoose.connect(process.env["MONGODB_URL"], {useNewUrlParser: true, useUnifiedTopology: true});

export default class PersistenceManager {
    public config: ScrapingConfigI = {} as ScrapingConfigI

    constructor(config: ScrapingConfigI) {
        this.config = config
    }

    async updateIndex(index: ScrapingIndexI) {
        const indexDb = Object.create(index)
        const conditions = {
            scraperId: indexDb.scraperId,
            newspaper: indexDb.newspaper
        }
        indexDb.dateScraping = new Date()

        if (this.config.useMongoDb) {
            try {
                await ScrapingIndex.findOneAndUpdate(conditions,
                    indexDb, {upsert: true})
            } catch (e) {
                console.log("ERROR UPDATING INDEX mongo")
                throw e
            }
        }

        if (this.config.useSqliteDb) {
            try {
                const indexSql = convertToScrapingIndexSqlI(indexDb)

                const startingUrlsSql = obtainScrapingIUrlsSqlI(index)
                const found = await ScrapingIndexSql.findOne({where: conditions})

                if (found) {
                    await ScrapingIndexSql.update(indexSql, {where: conditions})
                } else {
                    await ScrapingIndexSql.create(indexSql)
                    for (const url of startingUrlsSql) {
                        const foundUrl = await ScrapingUrlsSql.findOne({where: {url:url.url, newspaper: url.newspaper}})
                        if (!foundUrl) {
                            await ScrapingUrlsSql.create(url)
                        }
                    }
                }
            } catch (e) {
                console.log("ERROR UPDATING INDEX sqlite")
                throw e
            }
        }

    }

    async findCurrentIndex(newspaper: string): Promise<ScrapingIndexI> {
        let index: ScrapingIndexI

        const conditions = {
            scraperId: this.config.scraperId,
            newspaper: newspaper
        }
        if (this.config.useSqliteDb) {
            try {
                const startingUrlsSql = await ScrapingUrlsSql.findAll({where: conditions})

                const scrapingIndexDocumentM = await ScrapingIndexSql.findOne({where: conditions})
                if (scrapingIndexDocumentM && startingUrlsSql) {
                    const startingUrls = startingUrlsSql.map(item => item.toJSON() as ScrapingUrlsSqlI)
                    index = convertScrapingIndexSqlI(scrapingIndexDocumentM.toJSON() as ScrapingIndexSqlI, startingUrls)
                } else {
                    index = null
                }
            } catch (e) {
                console.log("error saving using sqlite")
                throw e
            }

        }

        if (this.config.useMongoDb) {
            try {
                let scrapingIndexDocument = await ScrapingIndex.findOne(conditions).exec();

                if (scrapingIndexDocument) {
                    index = scrapingIndexDocument.toObject()
                } else {
                    index = null
                }
            } catch (e) {
                console.log("error saving using mongodb")
                throw e
            }
        }
        return index
    }



    async findCurrentGlogalConfig(): Promise<GlobalConfigI> {
        let globalConfig: GlobalConfigI

        const conditions = {
            scraperId: this.config.scraperId,
        }
        if (this.config.useSqliteDb) {
            try {
                const globalConfigSql = await GlobalConfigSql.findOne({where: conditions})

                if (globalConfigSql) {
                    globalConfig =  globalConfigSql.toJSON() as GlobalConfigI
                } else {
                    globalConfig = null
                }
            } catch (e) {
                console.log("error saving global config using sqlite")
                throw e
            }

        }

        if (this.config.useMongoDb) {
            try {
                let globalConfgMongo = await GlobalConfig.findOne(conditions).exec();

                if (globalConfgMongo) {
                    globalConfig = globalConfgMongo.toObject()
                } else {
                    globalConfig = null
                }
            } catch (e) {
                console.log("error saving using mongodb")
                throw e
            }
        }
        return globalConfig
    }

    async updateGlobalConfig(globalConfig: GlobalConfigI) {
        const conditions = {
            scraperId: this.config.scraperId,
        }

        if (this.config.useSqliteDb) {
            const found = await GlobalConfigSql.findOne({where: conditions})
            if (found) {
                await GlobalConfigSql.update(globalConfig, {where: conditions})
            } else {
                await GlobalConfigSql.create(globalConfig)
            }
        }

        if (this.config.useMongoDb) {
            try {
                await GlobalConfig.findOneAndUpdate(conditions,
                    globalConfig, {upsert: true})
            } catch (e) {
                console.log("ERROR SAVING mongo")
                throw e
            }
        }
    }

    async saveNewsScraped(newItem: NewScrapedI) {
        const conditions = {url: newItem.url || ""}
        if (this.config.useSqliteDb && newItem.url) {
            newItem = this.cleanUpForSaving(newItem)
            try {
                const newsSql = convertToNewsScrapedSqlI(newItem)
                const found = await NewScrapedSql.findOne({where: conditions})
                if (found) {
                    await NewScrapedSql.update(newsSql, {where: conditions})
                } else {
                    await NewScrapedSql.create(newsSql)
                }
            } catch (e) {
                console.log("ERROR SAVING sqlite")
                throw e
            }
        }

        if (this.config.useMongoDb) {
            try {
                const scrapingIndexDocument = await NewScraped.findOneAndUpdate(conditions,
                    newItem, {upsert: true})
            } catch (e) {
                console.log("ERROR SAVING mongo")
                throw e
            }
        }

    }

    cleanUpForSaving(newItem: NewScrapedI) {
        if (!newItem.id || newItem.id==null) newItem.id = "error"
        if (!newItem.url || newItem.url==null) newItem.url = ""
        return newItem
    }

} 