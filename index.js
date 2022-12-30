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
        const commentCollection = client.db('qzonemdeia').collection('commentData')
        const userCollection = client.db('qzonemdeia').collection('userData')

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
        app.get('/homeposts', async (req, res) => {
            const query = {}
            const posts = postCollection.find(query).sort({ react: -1 })
            const result = await posts.toArray()
            res.send(result)
        })

        app.get('/postdetails/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: ObjectId(id)
            }
            const post = await postCollection.findOne(query)
            res.send(post)
        })

        app.post('/comment', async (req, res) => {
            const data = req.body
            const result = await commentCollection.insertOne(data)
            res.send(result)
        })

        app.get('/comment/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = {
                postId: id
            }
            const result = await commentCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)

        })

        app.put('/updateLike/:id', async (req, res) => {
            const reactorInfo = req.body
            const id = req.params.id
            console.log(id, reactorInfo)
            const result = await postCollection.updateOne({
                "_id": ObjectId(id),
                "reactor": { "$ne": reactorInfo.userEmail }
            },
                {
                    "$inc": { "react": 1 },
                    "$push": { "reactor": reactorInfo.userEmail }
                }
            )
            res.send(result)
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

