const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uuidv1 = require('uuid/v1');
mongoUrl = process.env['MONGODB_URL'];


const updateDocumentId = (document) => {
    return new Promise((resolve, reject) => {
        mongoClient.connect(mongoUrl, function (err, client) {
            if (err) {
                console.log(err);
                reject(err);
            }
            const collectionName = "NewsContentScraped";
            const dbName = "testing";
            const collection = client.db(dbName).collection(collectionName);

            if (!document.id || (document.id.indexOf("GTM"))){
                let date = document.date.toString().replace(new RegExp(" ", 'g'), "_").replace(new RegExp(":", 'g'), "_").replace(new RegExp(",", 'g'), "_").replace("+", "_");
                date = date.split("_GMT")[0];
                const id = document.scraper_id +"-" + date + "-" + uuidv1();
                document.id = id;
                console.log("---updating----");
                let res = collection.save(document, resolve);
            }
        });
    });
}
console.log(mongoUrl);

mongoClient.connect(mongoUrl, async function (err, client) {
    if (err) {
        console.log(err);
        reject(err);
    }
    const collectionName = "NewsContentScraped";
    const dbName = "testing";
    const collection = client.db(dbName).collection(collectionName);
    let cursor = collection.find({'id':null});
    await cursor.each(async function (err, item) {
        console.log(item.date);
        console.log(item.content.substring(0,100));
        await updateDocumentId(item);
    });
});
