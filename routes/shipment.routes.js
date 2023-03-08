const router = require("express").Router();
const Shipment = require("../models/Shipment.model");


router.get("/", (req, res, next) => {
    Shipment.find()
        .populate("User")
        .then(response => {
            res.json(response);
        })
        .catch(err => next(err))
});

///api/Shipment/new
router.post("/new", (req, res, next) => {
    const { author, creationDate, pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets } = req.body;
    Shipment.create({ author, creationDate, pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets })
        .then(response => {
            res.json(response);
        })
        .catch(err => next(err))
});

router.put("/edit/:idShipment", (req, res, next) => {
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
        .populate("User")
        .populate("Request")
        .then(result => {
            console.log("RESULT: ", result);
            res.json(result);
        })
        .catch(err => next(err))
});

module.exports = router;
