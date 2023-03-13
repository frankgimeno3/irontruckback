const express = require("express");
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");
// Require the Sender model in order to interact with the database
const Sender = require("../models/Sender.model");
// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new sender in the database
router.post("/signup", (req, res, next) => {
  const { email, password, name, image, phoneNumber, address, createdShipments, currentShipments, completedShipments, rejectedShipments } = req.body;

  // Check if email or password or name are provided as empty strings
  if (email === "" || password === "" || name === "" || phoneNumber === "" || address === "") {
    res.status(400).json({ message: "Provide all camps" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  //Check the phoneNumber is 9 caracters length

  if (!phoneNumber.length === 9) {
    res.status(400).json({
      message:
        "The phoneNumber is not correct",
    });
    return;
  }

  // Check the sender collection if a sender with the same email already exists
  Sender.findOne({ email, phoneNumber })
    .then((foundSender) => {
      // If the sender with the same email already exists, send an error response
      if (foundSender) {
        res.status(400).json({ message: "Sender already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new sender in the database
      // We return a pending promise, which allows us to chain another `then`
      return Sender.create({ email, password: hashedPassword, name, phoneNumber, address });
    })

    .then((createdSender) => {
      // Deconstruct the newly created sender object to omit the password
      // We should never expose passwords publicly
      const { _id, email, name, image, phoneNumber, address, createdShipments, currentShipments, completedShipments, rejectedShipments } = createdSender;

      // Create a new object that doesn't expose the password
      const sender = { _id, email, password, name, image, phoneNumber, address, createdShipments, currentShipments, completedShipments, rejectedShipments };

      // Send a json response containing the sender object
      res.status(201).json({ sender: sender });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the senders collection if a sender with the same email exists
  Sender.findOne({ email })
    .then((foundSender) => {
      if (!foundSender) {
        // If the sender is not found, send an error response
        res.status(401).json({ message: "Sender not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundSender.password);

      if (passwordCorrect) {
        // Deconstruct the sender object to omit the password
        const { _id, email, password, name, image } = foundSender;

        // Create an object that will be set as the token payload
        const payload = { _id, name, email, isTransportist: false };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the Sender" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  // console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the sender data
  res.status(200).json(req.payload);
});

module.exports = router;
