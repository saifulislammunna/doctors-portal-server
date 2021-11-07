const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u6dke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/* console.log(uri); */
async function run(){
    try{
        await client.connect();
        /*   console.log('database connected succesfully'); */

        const database = client.db('doctors_portal');
        const appointmentsCollection = database.collection('appointments');
        const usersCollection = database.collection('users');

        app.get('/appointments', async (req,res) => {
           const email = req.query.email;
           const date =  req.query.date;
          //  const date = new Date(req.query.date).toLocaleDateString();
            console.log(date);
            // let date = new Date();
            // add a day
            // date.setDate(date.getDate() + 1);
           const query = {email: email, date: date} 
          //  console.log(query);
           const cursor = appointmentsCollection.find(query);
           const appointments = await cursor.toArray();
           res.json(appointments);
        })

        // get single appointment submit
      app.post('/appointments', async(req,res) => {

        const appointment  = req.body;
        // console.log(appointment);
        const result = await appointmentsCollection.insertOne(appointment);
        
        // console.log(result);
        res.json(result)

      });

      app.post('/users', async(req,res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        console.log(result);
        res.json(result)

      });

      app.put('/users', async(req,res) => {
        const user = req.body;
        console.log('put', user);
        const filter = {email: user.email};
        const options = { upsert: true };
        const updateDoc = {$set: user};
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.json(result);
      })
      

    }
     
    finally{
        // connection active rakhar jonno comment kore rakhce
    //   await client.close();
    }

}
 
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Doctors portal!')
})

app.listen(port, () => {
  console.log('listening port at 5000')
})


/* app.get('/users')
app.get('/users/:id')
app.post('/users')
app.put('/users/:id')
app.delete('/users/:id') */
// user: get
// users: post