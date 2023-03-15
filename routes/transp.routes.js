const express = require("express");
const router = express.Router();

// const fileUploader = require('../config/cloudinary.config');

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");
// Require the User model in order to interact with the database
const Transportist = require("../models/Transportist.model");
// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /transportist/signup  - Creates a new transportist in the database
router.post("/signup", (req, res, next) => {
    const { email, password, name, phoneNumber, image, licensePlate, professionalType, company, nif, savedShipments, currentShipments, completedShipments, rejectedShipments, isAdmin } = req.body;

    // Check if email or password or name are provided as empty strings
    if (email === "" || password === "" || name === "") {
        res.status(400).json({ message: "Provide all camps" });
        return;
    }
    // phoneNumber === "" || licensePlate || professionalType === "" || nif === ""
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

    // if (!phoneNumber.length === 9) {
    //     res.status(400).json({
    //         message:
    //             "The Phone Number is not correct",
    //     });
    //     return;
    // }

    // Check the Tranpotist collection if a transportist with the same email already exists
    Transportist.findOne({ email, phoneNumber, nif, })
        .then((foundTransportist) => {
            // If the user with the same email already exists, send an error response
            if (foundTransportist) {
                res.status(400).json({ message: "Transportist already exists." });
                return;
            }

            // If email is unique, proceed to hash the password
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Create the new user in the database
            // We return a pending promise, which allows us to chain another `then`
            return Transportist.create({ email, password: hashedPassword, name, phoneNumber, });
        })

        .then((createdTransportist) => {
            // Deconstruct the newly created user object to omit the password
            // We should never expose passwords publicly
            const { email, name, _id, phoneNumber, image, licensePlate, professionalType, company, nif, savedShipments, currentShipments, completedShipments, rejectedShipments, isAdmin } = createdTransportist;

            // Create a new object that doesn't expose the password
            const transportist = { email, name, _id, phoneNumber, image, licensePlate, professionalType, company, nif, savedShipments, currentShipments, completedShipments, rejectedShipments, isAdmin };

            // Send a json response containing the user object
            res.status(201).json({ tranportist: transportist });
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

    // Check the users collection if a user with the same email exists
    Transportist.findOne({ email })
        .then((foundTransportist) => {
            if (!foundTransportist) {
                // If the user is not found, send an error response
                res.status(401).json({ message: "User not found." });
                return;
            }

            // Compare the provided password with the one saved in the database
            const passwordCorrect = bcrypt.compareSync(password, foundTransportist.password);

            if (passwordCorrect) {
                // Deconstruct the user object to omit the password
                const { _id, email, name, isTransportist } = foundTransportist;

                // Create an object that will be set as the token payload
                const payload = { _id, email, name, isTransportist: true };

                // Create a JSON Web Token and sign it
                const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                    algorithm: "HS256",
                    expiresIn: "6h",
                });

                // Send the token as the response
                res.status(200).json({ authToken: authToken });
            } else {
                res.status(401).json({ message: "Unable to authenticate the transportist" });
            }
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and is made available on `req.payload`
    // console.log(`req.payload`, req.payload);

    // Send back the token payload object containing the user data
    res.status(200).json(req.payload);
});

module.exports = router;
