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
const IndexScraper_1 = require("./IndexScraper");
class LATimesIndexScraper extends IndexScraper_1.IndexScraper {
    constructor(scrapingIndex) {
        super();
        this.urls = [];
        this.scrapingIndex = scrapingIndex;
        this.newspaper = scrapingIndex.newspaper;
        this.timeWaitStart = 1 * 1000;
        this.timeWaitClick = 500;
        this.maxPages = scrapingIndex.maxPages;
    }
    extractNewsUrlsInSectionPageFromIndexOneIteration() {
        return __awaiter(this, void 0, void 0, function* () {
            this.scrapingIndex.pageIndexSection = 1;
            if (this.scrapingIndex.urlIndex > this.scrapingIndex.startingUrls.length - 1) {
                this.scrapingIndex.urlIndex = 0;
                this.scrapingIndex.pageNewIndex = 1;
            }
            try {
                const currentUrl = this.scrapingIndex.startingUrls[this.scrapingIndex.urlIndex];
                const extractedUrls = yield this.extractUrlsFromStartingUrl(currentUrl);
                const uniqUrls = [...new Set(extractedUrls)];
                return uniqUrls;
            }
            catch (e) {
                return [];
            }
        });
    }
    extractUrlsFromStartingUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const urls = yield this.extractUrlsInPage(url);
                this.urls = this.urls.concat(urls);
            }
            catch (e) {
                console.log(e);
                return this.urls;
            }
            return this.urls;
        });
    }
    extractUrlsInPage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // https://www.thesun.co.uk/tv/page/1/
            const pageUrl = url;
            console.log("\n************");
            console.log("extracting full index in url:");
            console.log(pageUrl);
            console.log("************");
            const urls = [];
            yield this.initializePuppeteer();
            try {
                yield this.page.goto(pageUrl, { waitUntil: 'load', timeout: 0 });
                yield this.scrollToButtonClickNext();
                const urlsInPage = yield this.extractUrlsFromPage();
                yield this.browser.close();
                yield this.page.waitFor(this.timeWaitStart);
                return urlsInPage;
            }
            catch (err) {
                console.log(err);
                yield this.page.screenshot({ path: 'error_extract_new.png' });
                yield this.browser.close();
                throw err;
            }
        });
    }
    extractUrlsFromPage() {
        return __awaiter(this, void 0, void 0, function* () {
            let hrefs = yield this.page.$$eval('a', (as) => as.map((a) => a.href));
            const date_regex = /\d{4}-\d{2}-\d{2}/;
            //hrefs = ["https://edition.cnn.com/2020/12/24/media/biden-trump-media/index.html"]
            return hrefs.filter((href) => {
                return date_regex.test(href) && !href.includes("/videos/");
            });
        });
    }
    scrollToButtonClickNext() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 1; i <= 2; i++) {
                try {
                    yield this.page.evaluate(() => {
                        window.scrollBy(0, 1000);
                    });
                }
                catch (e) {
                    //console.log(e)
                }
                let [button] = yield this.page.$x("//button[contains(., 'Load More')]");
                if (button) {
                    yield button.click();
                }
                console.log("scrolling down " + i);
                console.log("clicking down " + i);
                const factor = Math.random() * 0.5;
                yield this.page.waitFor(this.timeWaitStart * factor);
            }
        });
    }
}
exports.LATimesIndexScraper = LATimesIndexScraper;
//# sourceMappingURL=LATimesIndexScraper.js.map