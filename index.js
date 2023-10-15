const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middlewer

app.use(cors());
app.use(express.json())

// tea-store
// QkhAA1aPHDR77Dj3

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.loifkbc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});

async function run() {
      try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();

            const teaCollection = client.db("teaDB").collection('tea');
            
            // step:2 all data pawar jonno abon ui te (/tea)use kore data fetch korar jonno
            app.get('/tea', async(req, res)=>{
                  const cursor = teaCollection.find();
                  const result = await cursor.toArray();
                  res.send(result)
            })


            // step:4 
            app.get('/tea/:id',async(req,res)=>{
                  const id= req.params.id;
                  const query = {_id: new ObjectId(id)};
                  const result = await teaCollection.findOne(query);
                  res.send(result)
            })

            // Step:1 set post methodh for ui theke j rut a data patabe
            app.post('/tea',async(req, res)=>{
                  const newTea=req.body;
                  console.log(newTea);
                  const result = await teaCollection.insertOne(newTea)
                  res.send(result)
            })

            

            // step:5 data update ar jonno PUT oparation
            app.put('/tea/:id',async(req, res)=>{
                  const id= req.params.id;
                  const filter = {_id: new ObjectId(id)};
                  const options = { upsert: true };
                  const updateTea = req.body;
                  const tea= {
                        $set: {
                              name:updateTea.name,
                              chef:updateTea.chef,
                              test:updateTea.test,
                              photo:updateTea.photo
                        }
                  }
                  const result = await teaCollection.updateOne(filter,tea,options);
                  res.send(result)
            })



            // step:3 data delete oparation 
            app.delete('/tea/:id',async(req, res)=>{
                  const id =req.params.id;
                  const query={_id: new ObjectId(id)};
                  const result = await teaCollection.deleteOne(query);
                  res.send(result)
            })

            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
            // Ensures that the client will close when you finish/error
            //     await client.close();
      }
}
run().catch(console.dir);







app.get('/', (req, res) => {
      res.send('simple CRUD is RUNNING')
})

app.listen(port, () => {
      console.log(`simple CRUD is running on port,${port}`);
})