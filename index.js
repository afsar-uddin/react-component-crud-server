/* 
crudUsers
106XUcSXGHFUohb0
*/
const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DB CONNECT
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cmhhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cmhhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function crudeUsers() {
    try {
        await client.connect();
        // console.log('db connected')
        const database = client.db('crudUser');
        const usersCollection = database.collection('users');

        const user = {
            name: "Afsar",
            email: "afsarmd@gmail.com"
        };
        const result = await usersCollection.insertOne(user);
        // console.log(`data inserted with the _id: ${result.insertedId}`);

        // GET API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const usersArray = await cursor.toArray();
            res.send(usersArray)
        });

        // POST API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            // console.log('got new user', req.body);
            // console.log('added user', result);
            res.json(result)
        });

        // SINGLE API
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('single user', id);
            const query = { _id: ObjectId(id) };
            const singleUser = await usersCollection.findOne(query);
            res.send(singleUser);
        });

        // UPDATE API
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            // console.log('updating user ', id);
            res.send(result)
        });

        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            // console.log(('deleted user ', result));
            res.json(result);
        })



    } finally {
        // await client.close();
    }
}
crudeUsers().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server running')
});

app.listen(port, () => {
    console.log('server running on ', port)
});