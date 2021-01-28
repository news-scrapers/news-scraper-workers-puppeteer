"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class NewScrapedSql extends sequelize_1.Model {
}
exports.NewScrapedSql = NewScrapedSql;
exports.newScrapedSqlAttributes = {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true
    },
    newspaper: {
        type: sequelize_1.DataTypes.STRING,
    },
    author: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
    },
    scrapedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
    },
    headline: {
        type: sequelize_1.DataTypes.STRING,
    },
    tags: {
        type: sequelize_1.DataTypes.STRING,
    },
    url: {
        type: sequelize_1.DataTypes.STRING,
    },
    scraperId: {
        type: sequelize_1.DataTypes.STRING,
    }
};
exports.joiningStrtags = ",";
exports.convertToNewsScrapedSqlI = (newScrapedI) => {
    const newScrapedSql = newScrapedI;
    if (newScrapedSql.tags && Array.isArray(newScrapedSql.tags)) {
        const tags = newScrapedSql.tags;
        newScrapedSql.tags = tags.join(exports.joiningStrtags);
    }
    return newScrapedSql;
};
exports.convertNewsScrapedSqlI = (newScrapedSqlI) => {
    const index = newScrapedSqlI;
    if (newScrapedSqlI.tags.includes(exports.joiningStrtags)) {
        const tags = newScrapedSqlI.tags;
        index.tags = tags.split(exports.joiningStrtags);
    }
    return index;
};
//# sourceMappingURL=NewScrapedSql.js.map