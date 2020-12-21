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
const ElPaisNewContentScraper_1 = require("../src/scrapers/ElPaisNewContentScraper");
require('dotenv').config();
describe('El pais new scraper', function () {
    describe('test scraper in a for a given new', function () {
        const date = new Date();
        const scraper = new ElPaisNewContentScraper_1.ElPaisNewContentScraper();
        jest.setTimeout(59999);
        it('scraping results shoud be not null', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const url = "https://elpais.com/economia/2019/03/01/actualidad/1551457314_646821.html";
                const result = yield scraper.extractReviewsInUrl(url);
                console.log(result);
                expect(result).toHaveProperty("content");
            });
        });
    });
});
//# sourceMappingURL=ElPaisNewContentScraper.test.js.map