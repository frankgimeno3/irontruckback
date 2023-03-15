const express = require("express");
const router = express.Router();
// const fileUploader = require("../config/cloudinary.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Transportist = require("../models/Transportist.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const saltRounds = 10;

router.post("/signup", (req, res, next) => {
    const {
        email,
        password,
        name,
        phoneNumber,
        image,
        licensePlate,
        professionalType,
        company,
        nif,
        currentShipments,
        completedShipments,
        rejectedShipments,
        isAdmin } = req.body;

    if (email === "" || password === "" || name === "") {
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
    //     res.status(400).json({
    //         message:
    //             "The Phone Number is not correct",
    //     });
    //     return;
    // }

    Transportist.findOne({ email, phoneNumber, nif, })
        .then((foundTransportist) => {
            if (foundTransportist) {
                res.status(400).json({ message: "Transportist already exists." });
                return;
            }
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            return Transportist.create({ email, password: hashedPassword, name, phoneNumber, });
        })

        .then((createdTransportist) => {
            const { email, name, _id, phoneNumber, image, licensePlate, professionalType, company, nif, savedShipments, currentShipments, completedShipments, rejectedShipments, isAdmin } = createdTransportist;
            const transportist = { email, name, _id, phoneNumber, image, licensePlate, professionalType, company, nif, savedShipments, currentShipments, completedShipments, rejectedShipments, isAdmin };

            res.status(201).json({ tranportist: transportist });
        })
        .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
    const { email, password } = req.body;

    if (email === "" || password === "") {
        res.status(400).json({ message: "Provide email and password." });
        return;
    }

    Transportist.findOne({ email })
        .then((foundTransportist) => {
            if (!foundTransportist) {
                res.status(401).json({ message: "Transportist not found." });
                return;
            }

            const passwordCorrect = bcrypt.compareSync(password, foundTransportist.password);

            if (passwordCorrect) {
                const { _id, email, name, isTransportist } = foundTransportist;

                const payload = { _id, email, name, isTransportist: true };

                const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                    algorithm: "HS256",
                    expiresIn: "6h",
                });

                res.status(200).json({ authToken: authToken });
            } else {
                res.status(401).json({ message: "Unable to authenticate the transportist" });
            }
        })
        .catch((err) => next(err));
});

router.get("/verify", isAuthenticated, (req, res, next) => {
    res.status(200).json(req.payload);
});

module.exports = router;
