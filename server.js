const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const AWS = require("aws-sdk");

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')  

const app = express()
const s3 = new AWS.S3()

app.use(bodyParser.json())
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 })

 app.get('/api/files/:filename', async (req, res) => {
    const filename = req.params.filename;
  
    try {
      const s3File = await s3.getObject({
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: filename,
      }).promise();
  
      res.set('Content-type', s3File.ContentType);
      res.send(s3File.Body.toString()).end();
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        console.log(`No such key ${filename}`);
        res.sendStatus(404).end();
      } else {
        console.log(error);
        res.sendStatus(500).end();
      }
    }
});

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p3mcyyf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(()=> {
        app.listen(process.env.PORT || 5000)
    })
    .catch(err => console.log(err))