const express = require("express");
const router = express.Router();
// const fileUploader = require("../config/cloudinary.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sender = require("../models/Sender.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  const {
    email,
    password,
    name,
    image,
    phoneNumber,
    address,
    createdShipments,
    currentShipments,
    completedShipments,
    rejectedShipments,
  } = req.body;

  if (
    email === "" ||
    password === "" ||
    name === "" ||
    phoneNumber === "" ||
    address === ""
  ) {
    res.status(400).json({ message: "Provide all camps" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  //Check the phoneNumber is 9 caracters length

  // if (!phoneNumber.length === 9) {
  //   res.status(400).json({
  //     message:
  //       "The phoneNumber is not correct",
  //   });
  //   return;
  // }

  Sender.findOne({ email, phoneNumber })
    .then((foundSender) => {
      if (foundSender) {
        res.status(400).json({ message: "Sender already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return Sender.create({
        email,
        password: hashedPassword,
        name,
        phoneNumber,
        address,
      });
    })

    .then((createdSender) => {

      const {
        _id,
        email,
        name,
        image,
        phoneNumber,
        address,
        createdShipments,
        currentShipments,
        completedShipments,
        rejectedShipments,
      } = createdSender;

      const sender = {
        _id,
        email,
        password,
        name,
        image,
        phoneNumber,
        address,
        createdShipments,
        currentShipments,
        completedShipments,
        rejectedShipments,
      };

      res.status(201).json({ sender: sender });
    })
    .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  Sender.findOne({ email })
    .then((foundSender) => {
      if (!foundSender) {
        res.status(401).json({ message: "Sender not found." });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(
        password,
        foundSender.password
      );

      if (passwordCorrect) {
        const { _id, email, password, name, image } = foundSender;

        const payload = { _id, name, email, isTransportist: false };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the Sender" });
      }
    })
    .catch((err) => next(err));
});

router.get("/verify", isAuthenticated, (req, res, next) => {

  res.status(200).json(req.payload);
});

module.exports = router;
