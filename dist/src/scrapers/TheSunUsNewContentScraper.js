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
exports.TheSunUsNewContentScraper = void 0;
const ContentScraper_1 = require("./ContentScraper");
const uuid_1 = require("uuid");
class TheSunUsNewContentScraper extends ContentScraper_1.ContentScraper {
    constructor(configPath = "../config/scrapingConfigFull.json") {
        super(configPath);
        this.cleanUp = (text) => {
            return text.replace(/\n/g, " ");
        };
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
    }
    extractNewInUrl(url, scraperId) {
        return __awaiter(this, void 0, void 0, function* () {
            // https://www.thesun.co.uk/tvandshowbiz/13409249/mark-wright-found-car-stolen-essex/
            console.log("\n---");
            console.log("extracting full new in url:");
            console.log(url);
            console.log("---");
            yield this.initializePuppeteer();
            try {
                yield this.page.goto(url, { waitUntil: 'load', timeout: 0 });
                yield this.page.waitFor(this.timeWaitStart);
                yield this.clickOkButtonCookie();
                const div = yield this.page.$('div.article-switcheroo');
                const content = yield this.extractBody(div);
                const headline = yield this.extractHeadline(div);
                const tags = yield this.extractTags();
                const date = yield this.extractDate();
                yield this.browser.close();
                yield this.page.waitFor(this.timeWaitStart);
                let results = { id: uuid_1.v4(), url, headline, content, date, tags, scraperId, scrapedAt: new Date() };
                return results;
            }
            catch (err) {
                console.log(err);
                yield this.page.screenshot({ path: 'error_extract_new.png' });
                yield this.browser.close();
                return null;
            }
        });
    }
    extractBody(div) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            const html =  await (await div.getProperty('innerHTML')).jsonValue();
            const text = htmlToText.fromString(html, {
                wordwrap: 130,
                ignoreHref:true
            });
            */
            try {
                const text = yield this.page.evaluate(element => element.textContent, div);
                return text;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    extractDate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = yield this.page.$eval("head > meta[property='article:published_time']", (element) => element.content);
                return new Date(date);
            }
            catch (e) {
                return null;
            }
        });
    }
    extractTags() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tags = yield this.page.$eval("head > meta[property='article:tag']", (element) => element.content);
                if (tags && tags.includes(",")) {
                    return tags.split(",").map((elem) => (elem.trim()));
                }
                return [tags];
            }
            catch (e) {
                return [];
            }
        });
    }
    extractHeadline(div) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const h1Headline = yield div.$('p.article__content--intro');
                const headline = yield (yield h1Headline.getProperty('textContent')).jsonValue();
                return headline;
            }
            catch (e) {
                return "";
            }
        });
    }
}
exports.TheSunUsNewContentScraper = TheSunUsNewContentScraper;
//# sourceMappingURL=TheSunUsNewContentScraper.js.map