import  {ElPaisNewContentScraper} from '../src/scrapers/ElPaisNewContentScraper'

require('dotenv').config();

describe('El pais new scraper', function () {
    describe('test scraper in a for a given new', function () {

        const date = new Date()
        const scraper = new ElPaisNewContentScraper();
        jest.setTimeout(59999)
        it('scraping results shoud be not null', async function () {
            const url = "https://elpais.com/economia/2019/03/01/actualidad/1551457314_646821.html"
            const result = await scraper.extractReviewsInUrl(url);
            console.log(result);
            expect(result).toHaveProperty("content")
        });
    });
});