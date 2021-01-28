"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.globalConfigSqlAttributes = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lastActive: {
        type: sequelize_1.DataTypes.DATE,
    },
    scraperId: {
        type: sequelize_1.DataTypes.STRING,
    },
    deviceId: {
        type: sequelize_1.DataTypes.STRING,
    },
    lastNewspaper: {
        type: sequelize_1.DataTypes.STRING,
    }
};
class GlobalConfigSql extends sequelize_1.Model {
}
exports.GlobalConfigSql = GlobalConfigSql;
//# sourceMappingURL=GlobalConfigSql.js.map