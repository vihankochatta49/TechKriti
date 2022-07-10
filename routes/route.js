const express = require("express");
const imgDb = require("./../routes/models");
const userDb = require("./../routes/registerModels");
const fs = require("fs");
const store = require("../config/multer");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/save/:name/:title", store.single("images"), (req, res) => {
  const createDoc = async () => {
    try {
      const files = req.file;
      let img = fs.readFileSync(files.path);
      encode_image = img.toString("base64");

      let finalimg = {
        filename: files.originalname,
        contentType: files.mimetype,
        imageBase64: encode_image,
      };

      const registeredUser = await userDb.findOne({
        slugName: req.params.name,
      });

      const apprec = new imgDb({
        name: registeredUser.name,
        title: req.params.title,
        filename: finalimg.filename,
        contentType: finalimg.contentType,
        imageBase64: finalimg.imageBase64,
      });
      const blog = await imgDb.insertMany([apprec]);
      res.redirect("/feed");
    } catch (err) {
      console.log(err);
    }
  };
  createDoc();
});

module.exports = router;
