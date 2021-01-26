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
const NewScrapedSql_1 = require("./NewScrapedSql");
const ScrapingIndexSql_1 = require("./ScrapingIndexSql");
const ScrapingUrlSql_1 = require("./ScrapingUrlSql");
const GlobalConfigSql_1 = require("./GlobalConfigSql");
exports.sequelize = new sequelize_1.Sequelize({
    storage: './database_news.sqlite3',
    dialect: 'sqlite',
});
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    NewScrapedSql_1.NewScrapedSql.init(NewScrapedSql_1.newScrapedSqlAttributes, {
        tableName: "NewScraped",
        sequelize: exports.sequelize,
    });
    ScrapingIndexSql_1.ScrapingIndexSql.init(ScrapingIndexSql_1.scrapingIndexSqlAttributes, {
        tableName: "ScrapingIndex",
        sequelize: exports.sequelize,
    });
    ScrapingUrlSql_1.ScrapingUrlsSql.init(ScrapingUrlSql_1.scrapingUrlSqlAttributes, {
        tableName: "ScrapingUrl",
        sequelize: exports.sequelize,
    });
    GlobalConfigSql_1.GlobalConfigSql.init(GlobalConfigSql_1.globalConfigSqlAttributes, {
        tableName: "GlobalConfig",
        sequelize: exports.sequelize,
    });
    yield NewScrapedSql_1.NewScrapedSql.sync({ force: false });
    yield ScrapingIndexSql_1.ScrapingIndexSql.sync({ force: false });
    yield ScrapingUrlSql_1.ScrapingUrlsSql.sync({ force: false });
    yield GlobalConfigSql_1.GlobalConfigSql.sync({ force: false });
});
exports.initDb = initDb;
//# sourceMappingURL=sequelizeConfig.js.map