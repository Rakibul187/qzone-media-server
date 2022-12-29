const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.farjvzi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const postCollection = client.db('qzonemdeia').collection('postData')

        app.post('/addpost', async (req, res) => {
            const data = req.body
            const result = await postCollection.insertOne(data)
            res.send(result)
        })

        app.get('/posts', async (req, res) => {
            const query = {}
            const posts = await postCollection.find(query).toArray()
            res.send(posts)
        })

        app.get('/postdetails/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = {
                _id: ObjectId(id)
            }
            console.log(query)
            const post = await postCollection.findOne(query)
            res.send(post)
        })


    }
    finally {

    }
}
run().catch(e => console.error(e))



app.get('/', (req, res) => {
    res.send('Qzone media server is running')
})

app.listen(port, () => {
    console.log(`Qzone Server running on ${port}`)
})

