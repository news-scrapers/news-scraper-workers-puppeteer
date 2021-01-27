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
exports.CnnNewContentScraper = void 0;
const ContentScraper_1 = require("./ContentScraper");
const uuid_1 = require("uuid");
class CnnNewContentScraper extends ContentScraper_1.ContentScraper {
    constructor(scraperId, newspaper) {
        super();
        this.excludedParagraphs = ["Please include a contact number if you are willing to speak to a BBC journalist", "If you are reading this page and can't see the form"];
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
            // https://edition.cnn.com/2020/12/28/politics/donald-trump-covid-relief-bill/index.html
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
                try {
                    yield this.page.goto(url, { waitUntil: 'load', timeout: 0 });
                }
                catch (e) {
                    return {};
                }
                const div = yield this.page.$('div.pg-rail-tall__body');
                const [headline, content, date, author, image, tags, description] = yield Promise.all([this.extractHeadline(), this.extractBody(div), this.extractDate(), this.extractAuthor(), this.extractImage(), this.extractTags(), this.extractDescription()]);
                yield this.browser.close();
                yield this.page.waitFor(this.timeWaitStart);
                let results = {
                    id: uuid_1.v4(),
                    url,
                    content,
                    headline,
                    tags,
                    date,
                    image,
                    author,
                    description,
                    scraperId: this.scraperId,
                    newspaper: this.newspaper,
                    scrapedAt: new Date()
                };
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
                const pars = yield this.page.$$("div.zn-body__paragraph");
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
                const date = yield this.page.$eval("head > meta[name='pubdate']", (element) => element.content);
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
                let tags = yield this.page.$eval("head > meta[name='section']", (element) => element.content);
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
    extractDescription() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const description = yield this.page.$eval("head > meta[property='og:description']", (element) => element.content);
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
                let headline = yield this.page.$eval("head > meta[name='author']", (element) => element.content);
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
exports.CnnNewContentScraper = CnnNewContentScraper;
//# sourceMappingURL=CnnNewContentScraper.js.map