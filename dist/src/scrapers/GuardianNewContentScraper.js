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
exports.GuardianNewContentScraper = void 0;
const ContentScraper_1 = require("./ContentScraper");
const uuid_1 = require("uuid");
class GuardianNewContentScraper extends ContentScraper_1.ContentScraper {
    constructor(scraperId, newspaper) {
        super();
        this.excludedParagraphs = [];
        this.cleanUp = (text) => {
            return text.replace(/\n/g, " ");
        };
        this.newspaper = newspaper;
        this.scraperId = scraperId;
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
    }
    extractNewInUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // https://www.theguardian.com/film/2021/jan/06/ham-on-rye-review-subversive-satire
            console.log("\n---");
            console.log("extracting full new in url:");
            console.log(url);
            console.log("---");
            try {
                yield this.initializePuppeteer();
            }
            catch (e) {
                console.log("error initializing");
            }
            try {
                yield this.page.goto(url, { waitUntil: 'load', timeout: 0 });
                const div = yield this.page.$('div.pg-rail-tall__body');
                const [headline, content, date, author, image, tags] = yield Promise.all([this.extractHeadline(), this.extractBody(div), this.extractDate(), this.extractAuthor(), this.extractImage(), this.extractTags()]);
                yield this.browser.close();
                yield this.page.waitFor(this.timeWaitStart);
                let results = { id: uuid_1.v4(), url, content, headline, tags, date, image, author, scraperId: this.scraperId, newspaper: this.newspaper, scrapedAt: new Date() };
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
            try {
                const pars = yield this.page.$$(".css-38z03z");
                let text = '';
                for (let par of pars) {
                    const textPar = yield this.page.evaluate(element => element.textContent, par);
                    const hasExcludedText = this.excludedParagraphs.some((text) => textPar.includes(text));
                    if (!hasExcludedText) {
                        text = text + '\n ' + textPar;
                    }
                }
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
                let date = yield this.page.$eval("head > meta[property='article:published_time']", (element) => element.content);
                date = new Date(date);
                return date;
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
                return null;
            }
        });
    }
    extractHeadline() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headline = yield this.page.$eval("head > meta[property='og:title']", (element) => element.content);
                return headline;
            }
            catch (e) {
                return null;
            }
        });
    }
    extractAuthor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headline = yield this.page.$eval("head > meta[property='article:author']", (element) => element.content);
                return headline;
            }
            catch (e) {
                return null;
            }
        });
    }
    extractImage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let headline = yield this.page.$eval("head > meta[property='og:image']", (element) => element.content);
                return headline;
            }
            catch (e) {
                return null;
            }
        });
    }
    clickOkButtonCookie() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const frame = this.page.frames();
                //frame[2].click('button[title="Fine By Me!"]');
            }
            catch (e) {
            }
        });
    }
}
exports.GuardianNewContentScraper = GuardianNewContentScraper;
//# sourceMappingURL=GuardianNewContentScraper.js.map