const express = require("express");
const imgDb = require("./../routes/models");
const userDb = require("./../routes/registerModels");
const fs = require("fs");
const store = require("../config/multer");
const router = express.Router();

//route for register page
router.get("/register", (req, res) => {
  res.render("register");
});

//route for login page
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/incentives", (req, res) => {
  res.render("incentives");
});
router.get("/contactus", (req, res) => {
  const persons = [
    {
      name: "Nitish Kumar",
      pos: "MANAGER,HOSPITALITY",
      mob: "+91-9835637958",
    },
    {
      name: "Kunal Saini",
      pos: "MANAGER,HOSPITALITY",
      mob: "+91-7231982706",
    },
    {
      name: "Ericlim Pallepogu",
      pos: "MANAGER, HOSPITALITY",
      mob: "+91-9835637958",
    },
    {
      name: "Anita Waskale",
      pos: "MANAGER, HOSPITALITY",
      mob: "+91-9835637958",
    },
    {
      name: "Aarjav",
      pos: "MANAGER, HOSPITALITY",
      mob: "+91-9835637958",
    },
    {
      name: "Prashant Raiger",
      pos: "HEAD, EVENTS AND COMPETITIONS",
      mob: "+91-9835637958",
    },
    {
      name: "Nikhil Verma",
      pos: "HEAD, EVENTS AND COMPETITIONS",
      mob: "+91-9835637958",
    },
  ];
  res.render("contactus", { persons });
});

//route for uploading images
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
      res.redirect(`/profile/${registeredUser.name}/${registeredUser.id}`);
    } catch (err) {
      console.log(err);
    }
  };
  createDoc();
});

module.exports = router;
