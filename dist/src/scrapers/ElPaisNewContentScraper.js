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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElPaisNewContentScraper = void 0;
const PuppeteerScraper_1 = require("./PuppeteerScraper");
const html_to_text_1 = __importDefault(require("html-to-text"));
class ElPaisNewContentScraper extends PuppeteerScraper_1.PuppeteerScraper {
    constructor() {
        super();
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
    }
    extractReviewsInUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // https://elpais.com/economia/2019/03/01/actualidad/1551457314_646821.html
            console.log("\n---");
            console.log("extracting full new in url:");
            console.log(url);
            console.log("---");
            yield this.initializePuppeteer();
            try {
                yield this.page.goto(url, { waitUntil: 'load', timeout: 0 });
                yield this.page.waitFor(this.timeWaitStart);
                const div = yield this.page.$('div.articulo__interior');
                const headline = yield this.extractHeadline(div);
                const content = yield this.extractBody(div);
                yield this.browser.close();
                yield this.page.waitFor(this.timeWaitStart);
                let results = { headline, content };
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
            const html = yield (yield div.getProperty('innerHTML')).jsonValue();
            const text = html_to_text_1.default.fromString(html, {
                wordwrap: 130
            });
            return text;
        });
    }
    extractHeadline(div) {
        return __awaiter(this, void 0, void 0, function* () {
            const h1Headline = yield div.$('h1');
            const headline = yield (yield h1Headline.getProperty('textContent')).jsonValue();
            return headline;
        });
    }
}
exports.ElPaisNewContentScraper = ElPaisNewContentScraper;
//# sourceMappingURL=ElPaisNewContentScraper.js.map