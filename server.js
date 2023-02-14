const express = require('express');
var bodyParser = require('body-parser')
const { Insta } = require('./models/instamodel');
const cors= require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const fileupload = require('express-fileupload') // to read paritioned data by form data in front end /// it is middleware to capture file data -- optional for multer /
mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGODB_URL)
    .then(()=> console.log("connected to mongodb"))
    .catch((err)=> console.log(err))


app.use(cors());    // enabling every application to use this api
app.use(express.json());// exp.json is middleware need to be passed as a argument for use method in exp function
// this will parse all the data send by client to string before making the call to api ie route
app.use(fileupload()); // since it is a middleware call it inside app.use method to parse form data's media files


app.get("/all", async (req, res) => {
    try {
      const posts = await Insta.find().sort({ _id: "-1" });
      res.json({
        status: "success",
        posts,
      });
    } catch (error) {
      res.json({
        status: "Failed",
        message: error.message,
      });
    }
  });

app.post("/post", (req, res) => {
    const { username, address, description } = req.body;
    const { image_file } = req.files;
    image_file.mv("./uploads/" + image_file.name, async (err) => {
      if (err) {
        res.json({
          message: err
        })
      }
  
      else 
      {
        const post = new Insta({
          ...{ username, address, description },
          image_file: image_file.name
        })
        try {
          const instaPost = await post.save()
          res.status(200).json({ message: "successfully added", instaPost })
          console.log(instaPost)
        }
        catch (err) {
          res.status(400).json({
            message: "Missing Credentials"
          })
          console.log(err)
        }
      }
    })
  })  

app.get("/images/:filename", async (req,res)=>{
  res.sendFile(path.join(__dirname,`./uploads/${req.params.filename}`))
})  
const PORT = process.env.port || 5000;

app.listen(PORT, ()=> console.log(`listening to port ${PORT}`));