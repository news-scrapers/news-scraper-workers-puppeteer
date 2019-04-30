const mongoClient = require('mongodb').MongoClient;
require('dotenv').load();
const uuidv1 = require('uuid/v1');
mongoUrl = process.env['MONGO_URL'];


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
            const id = document.scraper_id +"-"+ (new Date()).toString() + "-" + uuidv1();
            document.id = id;
            let res = collection.save(document, resolve);
        });
    });
}

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
        await updateDocumentId(item);
    });
});
