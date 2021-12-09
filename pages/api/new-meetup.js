import { MongoClient } from 'mongodb';

// the "api" folder is JUST for routes and backend code. This code will never run into the frontend. This is a secure place to store credentials !!
// /api/new-meetup
// only POST requests will be served (so this file is for POST requests).

async function handler(req, res) {
    if (req.method === 'POST') {
       const data = req.body;

       const client = await MongoClient.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kg7ic.azure.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);
       const db = client.db(); // call db() method of the object to hold of the DB we want

        // MongoDB  is a NoSQL DB which works with "collections of documents": each table is a collection and each entry is a document.

        const meetupsCollection = db.collection(`${process.env.DB_NAME}`); // As DB name, if collection doesn't exist, will be created.

        const result = await meetupsCollection.insertOne(data); // no need to make restructuring to enter only title, image etc....

        console.log(result); // see it in the server console !

        // <<< here should be error handling and try-catch block can be use >>>

        client.close();

        res.status(201).json({ message: 'Meetup inserted' });
    }
}

export default handler;