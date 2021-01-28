"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.scrapingUrlSqlAttributes = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    scraperId: {
        type: sequelize_1.DataTypes.STRING,
    },
    url: {
        type: sequelize_1.DataTypes.STRING,
    },
    newspaper: {
        type: sequelize_1.DataTypes.STRING,
    }
};
class ScrapingUrlsSql extends sequelize_1.Model {
}
exports.ScrapingUrlsSql = ScrapingUrlsSql;
//# sourceMappingURL=ScrapingUrlSql.js.map