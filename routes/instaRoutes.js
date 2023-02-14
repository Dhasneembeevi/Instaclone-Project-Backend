const { Router } = require('express');
const { Insta } = require('../models/instamodel');
const route = Router();

route.get("/all", async (req, res) => {
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
route.post("/post", (req, res) => {
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
module.exports = route;

//console.log(req.body)
  //console.log(req.image_file) // image_file variable in frontend (add post) formdata