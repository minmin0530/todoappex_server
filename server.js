const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const { dirname } = require('path');
const http = require('http').Server(app);

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'todoappex557';
const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const insertAccount = async (res, data) => {

    console.log(data);
    try {
        const client = await MongoClient.connect(url, connectOption);
        const db = client.db(dbName);
        const collection = db.collection('account');
        if (data.userid == null) {
            const dataid = await (await collection.find({}).toArray()).length;
            data = Object.assign(data, {userid: dataid});    
        }
        const a = await collection.updateOne({
            userid: data.userid
        }, {$set: data}, true);
        if (a.result.n == 0) {
            await collection.insertOne(data);
            console.log("first insert account");
        } else if (a.result.n >= 1) {
            console.log("success insert account");
        } else {
            console.log("insert error account");
        }

    } catch (error) {
        console.log(error);
    } finally {
    }
};

const insertItem = async (res, data) => {

    try {
        const client = await MongoClient.connect(url, connectOption);
        const db = client.db(dbName);
        const collection = db.collection('item');

        const a = await collection.updateOne({
            itemid: data.itemid
        }, {$set: data}, true);
        if (a.result.n == 0) {
            await collection.insertOne(data);
            console.log("first insert item");
        } else if (a.result.n >= 1) {
            console.log("success insert item");
        } else {
            console.log("insert error item");
        }

    } catch (error) {
        console.log(error);
    } finally {
    }
};


const getAccounts = async (res) => {

    try {
        const client = await MongoClient.connect(url, connectOption);
        const db = client.db(dbName);
        const collection = db.collection('account');
        await collection.find({}).toArray( async (err, docs) => {
            await res.json(docs);
        });
    } catch (error) {
        console.log(error);
    } finally {
    }
};

const getItems = async (res) => {
    try {
        const client = await MongoClient.connect(url, connectOption);
        const db = client.db(dbName);
        const collection = db.collection('item');
        await collection.find({}).toArray( async (err, docs) => {
            await res.json(docs);
        });
    } catch (error) {
        console.log(error);
    } finally {
    }
};

app.post('/insert_account', (req, res) => {
    insertAccount(res, { name: req.body.accountname});
});

app.post('/insert_item', (req, res) => {
    insertItem(res, {itemid: 9876, title: "test title"});
});

app.get('/get_accounts', (req, res) => {
    getAccounts(res);
});

app.get('/get_items', (req, res) => {
    getItems(res);
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/insert_account', (req, res) => {
    res.sendFile(__dirname + '/insert_account.html');
});

http.listen(80, () => {
    console.log('listening on :80');
});