const express = require('express');

const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;

// const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.akfpp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://nannySam:sam0123@cluster0.akfpp.mongodb.net/happyBaby?retryWrites=true&w=majority";

const app = express();


const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
  res.send('HELLO FROM MONGODB');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err);
  const appointmentCollection = client.db("happyBaby").collection("appointments");
  const clientReviewCollection = client.db("happyBaby").collection("clientReview");
  const serviceCollection = client.db("happyBaby").collection("service");
  const adminCollection = client.db("happyBaby").collection("adminList");
  // const userAppointmentCollection = client.db("happyBaby").collection("userAppointment");


  app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
      .then(result => {
        res.send(result.insertedCount > 0)

      });
  })


 
  app.get('/getAppointment', (req, res) => {
    appointmentCollection.find({})
      .toArray((err, services) => {
        res.send(services)
      })
  })


  app.get('/userBooking', (req, res) => {
    appointmentCollection.find({email : req.query.email})
      .toArray((err, doc) => {
        console.log( req.query.email);
        res.send(doc)
        console.log(doc);
      })
  })


  app.post('/clientReview', (req, res) => {
    const clientReview = req.body;
    clientReviewCollection.insertOne(clientReview)
      .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/getClientReview', (req, res) => {
    clientReviewCollection.find({})
      .toArray((err, review) => {
        res.send(review)
      })
  })
  app.post('/addService', (req, res) => {
    const addService = req.body;
    serviceCollection.insertOne(addService)
      .then(result => {
        console.log(result)
      })
  })

  app.get('/getAddService', (req, res) => {
    serviceCollection.find({})
      .toArray((err, service) => {
        res.send(service)
      })
  })

  app.post('/makeAdmin', (req, res) => {
    const adminList = req.body;
    adminCollection.insertOne(adminList)
      .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/getAddManage', (req, res) => {
    serviceCollection.find({})
      .toArray((err, manageService) => {
        res.send(manageService)
      })
  })
  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    serviceCollection.deleteOne({ _id: id })
      .then(documents => {
        res.send(documents.deletedCount > 0)
      })
  })
})


app.listen(process.env.PORT || port);