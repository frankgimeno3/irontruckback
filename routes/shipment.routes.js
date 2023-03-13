const router = require("express").Router();
const Shipment = require("../models/Shipment.model");
const Sender = require("../models/Sender.model");
// import { AuthContext } from "../../irontruck/src/context/auth.context";
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Sender = require("../models/Sender.model");
// import { AuthContext } from "../../irontruck/src/context/auth.context";
const { isAuthenticated } = require("../middleware/jwt.middleware");


router.get("/", (req, res, next) => {
    Shipment.find()
        .populate("author")
        .then(response => {
            res.json(response);
        })
        .catch(err => next(err))
});

///api/Shipment/new
router.post("/new", (req, res, next) => {
    const { creationDate, pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets, author } = req.body;

    console.log(req.current)

    console.log(req.body)

    Shipment.create({ author, creationDate, pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets, author })
        .then(response => {
            return Sender.findByIdAndUpdate(author, { $push: { createdShipments: response._id } }, { new: true })
        })

        .then(response => {
            console.log(response)

        })
        .catch(err => next(err))
});

// router.post("/new", (req, res, next) => {
//     const { author, creationDate, pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets } = req.body;
//     console.log(req.body)
//     Shipment.create({ author, creationDate, pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets })
//         // .then(response => {
//         //     console.log(response)

//         //     // return Sender.findByIdAndUpdate(author, { $push: { createdShipments: response } }, { new: true })
//         // })
//         .then((data) => {
//              res.json(response) })

//         .catch(err => next(err))
// });

// router.post("/new", (req, res, next) => {
//     const { author, creationDate, pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets } = req.body;
//     console.log(req.body)
//     Shipment.create({ author, creationDate, pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets })
//         // .then(response => {
//         //     console.log(response)

//         //     // return Sender.findByIdAndUpdate(author, { $push: { createdShipments: response } }, { new: true })
//         // })
//         .then((data) => {
//              res.json(response) })

//         .catch(err => next(err))
// });


router.put("/edit/:idshipment", (req, res, next) => {
    const { idShipment } = req.params;
    const { pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets } = req.body;

    Shipment.findByIdAndUpdate(idShipment, { pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets }, { new: true })
        .then(result => {
            res.json(result);
        })
        .catch(err => next(err))
});
///api/projects/delete/:idProject
router.delete("/delete/:id", (req, res, next) => {
    const { idShipment } = req.params;
    Shipment.findByIdAndDelete(idShipment)
        .then(response => {
            res.json({ resultado: "ok" });
        })
        .catch(err => next(err))
});

///api/projects/:idProject
router.get("/:idShipment", (req, res, next) => {
    const { idShipment } = req.params;
    Shipment.findById(idShipment)
        .populate("author")
        .then(result => {
            console.log("RESULT: ", result);
            res.json(result);
        })
        .catch(err => next(err))
});

module.exports = router;
