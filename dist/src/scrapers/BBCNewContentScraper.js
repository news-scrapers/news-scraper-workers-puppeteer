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
class BBCNewContentScraper extends ContentScraper_1.ContentScraper {
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
            // https://www.thesun.co.uk/tvandshowbiz/13409249/mark-wright-found-car-stolen-essex/
            console.log("\n---");
            console.log("extracting full new in url:");
            console.log(url);
            console.log("---");
            yield this.initializePuppeteer();
            try {
                yield this.page.goto(url, { waitUntil: 'load', timeout: 0 });
                const div = yield this.page.$('article');
                const [content, headline, tags, date] = yield Promise.all([this.extractBody(div), this.extractHeadline(div), this.extractTags(div), this.extractDate(div)]);
                yield this.browser.close();
                yield this.page.waitFor(this.timeWaitStart);
                let results = { id: uuid_1.v4(), url, headline, content, date, tags, scraperId: this.scraperId, newspaper: this.newspaper, scrapedAt: new Date() };
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
                const pars = yield div.$$("div[data-component='text-block']");
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
    extractDate(div) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = yield div.$eval("time", (el) => el.getAttribute("datetime"));
                return new Date(date);
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    extractTags(div) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = yield div.evaluate(() => {
                    const as = document.getElementsByTagName('a');
                    const tags = [];
                    for (let a of as) {
                        if (a.href.includes("/topics/")) {
                            tags.push(a.textContent);
                        }
                    }
                    return tags;
                });
                return tags;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
    }
    extractHeadline(div) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const h1Headline = yield div.$('h1#main-heading');
                const headline = yield (yield h1Headline.getProperty('textContent')).jsonValue();
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
exports.BBCNewContentScraper = BBCNewContentScraper;
//# sourceMappingURL=BBCNewContentScraper.js.map