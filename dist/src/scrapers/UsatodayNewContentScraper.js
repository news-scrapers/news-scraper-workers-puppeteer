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
const ContentScraper_1 = require("./ContentScraper");
const uuid_1 = require("uuid");
class UsatodayNewContentScraper extends ContentScraper_1.ContentScraper {
    constructor(scraperId, newspaper) {
        super();
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
            console.log("\n---");
            console.log("extracting full new in url:");
            console.log(url);
            console.log("---");
            yield this.initializePuppeteer();
            try {
                try {
                    yield this.page.goto(url, { waitUntil: 'load', timeout: 0 });
                }
                catch (e) {
                    return {};
                }
                const [content, headline, author, date, description] = yield Promise.all([this.extractBody(), this.extractHeadline(), this.extractAuthor(), this.extractDate(), this.extractDescription()]);
                yield this.browser.close();
                yield this.page.waitFor(this.timeWaitStart);
                let results = { id: uuid_1.v4(), url, headline, content, date, author, description, scraperId: this.scraperId, newspaper: this.newspaper, scrapedAt: new Date() };
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
    extractBody() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const article = yield this.page.$("article");
                const pars = yield article.$$("p");
                let text = '';
                for (let par of pars) {
                    const textPar = yield this.page.evaluate(element => element.textContent, par);
                    text = text + '\n ' + textPar;
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
                const date = yield this.page.$eval("lit-timestamp", (element) => element);
                return new Date(date.__publishDate);
            }
            catch (e) {
                return null;
            }
        });
    }
    extractDescription() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const description = yield this.page.$eval("head > meta[name='description']", (element) => element.content);
                return description;
            }
            catch (e) {
                return null;
            }
        });
    }
    extractAuthor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aut = yield this.page.$("a.authors");
                const author = yield this.page.evaluate(element => element.textContent, aut);
                return author;
            }
            catch (e) {
                return null;
            }
        });
    }
    extractTags() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tags = yield this.page.$eval("head > meta[name='keywords']", (element) => element.content);
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
    extractHeadline() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const headline = yield this.page.$eval("title", (element) => element.textContent);
                return headline;
            }
            catch (e) {
                return null;
            }
        });
    }
}
exports.UsatodayNewContentScraper = UsatodayNewContentScraper;
//# sourceMappingURL=UsatodayNewContentScraper.js.map