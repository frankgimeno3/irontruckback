const express = require("express");
const router = express.Router();
// import { createContext, useEffect, useState } from "react";
// import { AuthContext } from "../../irontruck/src/context/auth.context";
// const User = require("../models/User.model");

const Transportist = require("../models/Transportist.model");
const Sender = require("../models/Sender.model");


<<<<<<< HEAD
// ********* require fileUploader in order to use it *********
=======
// // ********* require fileUploader in order to use it *********
>>>>>>> 4cb9fcc (to funciona de momento)
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");



// PUT /" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.put("/:id", isAuthenticated, fileUploader.single("imageUrl"), (req, res, next) => {
  const { idProject } = req.params;
  const { email, name, phoneNumber, address, password, repeatPassword } = req.body;
  const updateFields = { email, name, phoneNumber, address, password, repeatPassword };

  // GET "/:id" => Route to your profile
  router.get("/:id", isAuthenticated, (req, res, next) => {
    const { id: idProject } = req.params;
    // const { licensePlate } = user.licensePlate;

    if (!req.payload.isTransportist) {
      Sender.findById({ idProject })
        .then(result => {
          res.json(result);
        })
        .catch(err => next(err))
    }

    if (licensePlate) {

      Transportist.findById({ idProject })
        .then(result => {
          res.json(result);
        })
        .catch(err => next(err))
    }
  });



  // PUT /" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
  router.put("/:id", isAuthenticated, fileUploader.single("imageUrl"), (req, res, next) => {
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

  module.exports = router; 
