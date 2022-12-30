const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

//aKPBuprbp82qaMDL
//endGameDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.bsfuvd2.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
     try{
          const userCollection = client.db('endgametask').collection('userdata')
          const postCollection = client.db('endgametask').collection('allPost')
          const commentCollection = client.db('endgametask').collection('comment')

          app.post('/user', async(req, res) =>{
               const user = req.body;
               const result = await userCollection.insertOne(user)
               res.send(result)              
          })
          app.post('/userpost', async(req, res) =>{
               const post = req.body;
               const result = await postCollection.insertOne(post)
               res.send(result)
          })
          app.get('/allpost', async(req, res) =>{
               const query = {}
               const result = await postCollection.find(query).sort({time: -1}).toArray()
               res.send(result)
          })
          app.get('/postdetails/:id', async(req, res) =>{
               const id = req.params.id;
               const query = {_id: ObjectId(id)};
               const result = await postCollection.find(query).toArray()
               res.send(result)
          })
          app.post('/comment', async(req, res) =>{
               const comment = req.body;
               const result = await commentCollection.insertOne(comment)
               res.send(result)
          })
          app.get('/comment', async(req, res) =>{
               const query = {}
               const result = await commentCollection.find(query).toArray()
               res.send(result)
          })
          app.get('/userInfo', async(req, res) =>{
               const email = req.query.email;
               const query = {email: email};
               const about = await userCollection.find(query).toArray()
               res.send(about)
          })
          app.put('/editporfile/:id', async(req, res) =>{
               const id = req.params.id;
               const filter = {_id: ObjectId(id)}
               const user = req.body;
               const option = {upsert: true}
               const updateUser = {
                    $set:{
                         name: user.name,
                         university: user.university,
                         address: user.address
                    }
               }
               const result = await userCollection.updateOne(filter,updateUser,option)
               res.send(result)
          })

          app.get('/poplurPost', async(req, res) =>{
               const query = {}
               const result = await postCollection.find(query).limit(3).sort({like: -1},{love: -1}).toArray()
               res.send(result)
          })
          app.put('/like/:id', async(req, res) =>{
               const id = req.params.id;
               const filter = {_id: ObjectId(id)}
               const options = {upsert: true}
               const updateDoc ={
                    $push:{
                         like: req.body.id
                    }
               }
               const result = await postCollection.updateOne(filter, updateDoc, options)
               res.send(result)
          })
          
          app.put('/love/:id', async(req, res) =>{
               const id = req.params.id;
               const filter = {_id: ObjectId(id)}
               const options = {upsert: true}
               const updateDoc ={
                    $push:{
                         love: req.body.id
                    }
               }
               const result = await postCollection.updateOne(filter, updateDoc, options)
               res.send(result)
          })

     }
     finally{

     }
}
run().catch(err => console.error(err))


app.get('/', async(req, res) =>{
     res.send('server running')
})
app.listen(port,() => console.log(`endgame task running on ${port}`))