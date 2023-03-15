const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;


const Transportist = require("../models/Transportist.model");
const Sender = require("../models/Sender.model");

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET "/:id" => Route to your profile
router.get("/myprofile/:id", isAuthenticated, (req, res, next) => {
  const { id: id } = req.params;


  if (!req.payload.isTransportist) {
    Sender.findById(id)
      .populate("createdShipments")
      .then(result => {
        res.json(result);
      })
      .catch(err => console.log(err))
  }

  if (req.payload.isTransportist) {

    Transportist.findById(id)
      .then(result => {
        res.json(result);
      })
      .catch(err => next(err))
  }
});

router.get("/:id", isAuthenticated, (req, res, next) => {
  const { id: id } = req.params;


  if (!req.payload.isTransportist) {
    Sender.findById(id)
      .populate("createdShipments")
      .then(result => {
        res.json(result);
      })
      .catch(err => console.log(err))
  }

  if (req.payload.isTransportist) {

    Transportist.findById(id)
      .then(result => {
        res.json(result);
      })
      .catch(err => next(err))
  }
});

// PUT /" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.put("/myprofile/:id", isAuthenticated, (req, res, next) => {
  const { id: id } = req.params;
  const { phoneNumber, address, password, repeatPassword, image } = req.body;
  console.log("req.body:", req.body)
  const updateFields = { phoneNumber, address, password, repeatPassword, image };

  if (password !== repeatPassword) {
    res.status(400).json({ message: "Password and repeat password must be the same" });
    return;
  }

  if (password === "" || phoneNumber === "" || address === "") {
    res.status(400).json({ message: "Provide all fields" });
    return;
  }
console.log("phoneNumber:", phoneNumber)
console.log("password:", password)
console.log("repeatpassword:", repeatPassword)
console.log("address:", address)


  if (phoneNumber.length !== 9) {
    res.status(400).json({message: "The phoneNumber is not correct",
    });
    return;
  }
console.log("entra");
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }
  console.log("entra2");

  let salt = bcrypt.genSaltSync(saltRounds);
  let hashedPass = bcrypt.hashSync(password, salt);
  updateFields.password = hashedPass;
  console.log("entra3");

  if (!req.payload.isTransportist) {

    Sender.findByIdAndUpdate ( id, updateFields, { new: true } )
    .then(response => {
      console.log(response.data);
      console.log("entra5");
      res.status(200).json(req.payload);
    })
      .catch(err => console.log("error del find del Sender:", err))
  }


  if (req.payload.isTransportist) {
    Transportist.findByIdAndUpdate ( id, updateFields, { new: true } )
        .then(response => {
      console.log(response.data);
      console.log("entra6");
      res.status(200).json(req.payload);
    })
      .catch(err => next(err))
  }

  // Delete "/:id" => Route to your profile
  router.delete("/myprofile/:id", (req, res, next) => {
    const { id: id } = req.params;
  
    if (!req.payload.isTransportist) {
      Sender.findByIdAndDelete(id)
        .then(result => {
          res.json(result);
        })
        .catch(err => console.log(err))
    }
  
    if (req.payload.isTransportist) {
  
      Transportist.findByIdAndDelete( id )
        .then(result => {
          res.json(result);
        })
        .catch(err => next(err))
    }
  });
});
 
// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/myprofile/upload", fileUploader.single("image"), (req, res, next) => {
  // console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});

module.exports = router; 