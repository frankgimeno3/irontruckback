const express = require("express");
const router = express.Router();
// import { createContext, useEffect, useState } from "react";
// import { AuthContext } from "../../irontruck/src/context/auth.context";
// const User = require("../models/User.model");

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");


// useEffect(() => {
//   authenticateUser();
// }, []);

// const {user} = useContext(AuthContext);

// GET "/:id" => Route to your profile
router.get("/:id", isAuthenticated, (req, res, next) => {
 const { idProject } = user._id;
 const { licensePlate } = user.licensePlate;

 if(!licensePlate)
  Sender.findById({idProject})
  .then(result => {
    res.json(result);
})
.catch(err => next(err))
if(licensePlate)

Transportist.findById({idProject})
.then(result => {
  res.json(result);
})
.catch(err => next(err))
});


 
// PUT /" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.put ("/:id", isAuthenticated, fileUploader.single("imageUrl"), (req, res, next) => {
  const { idProject } = req.params;
  // console.log("file is: ", req.file)
  const { email, name, _id, phoneNumber, address } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }
  if (!phoneNumber.length === 9) {
    res.status(400).json({
      message:
        "The phoneNumber is not correct",
    });
    return;
  }
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.secure_url });
});
 
// POST '/api/movies' => for saving a new movie in the database
router.post('/movies', (req, res, next) => {
  // console.log('body: ', req.body); ==> here we can see that all
  // the fields have the same names as the ones in the model so we can simply pass
  // req.body to the .create() method
 
  Movie.create(req.body)
    .then(createdMovie => {
      // console.log('Created new movie: ', createdMovie);
      res.status(200).json(createdMovie);
    })
    .catch(err => next(err));
});
 
module.exports = router; 