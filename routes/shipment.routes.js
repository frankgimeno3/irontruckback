const router = require("express").Router();
const Shipment = require("../models/Shipment.model");
const Sender = require("../models/Sender.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");



router.get("/", (req, res, next) => {
    Shipment.find()
        .populate("author")
        .populate("transportists")
        .then(response => {
            res.json(response);
        })
        .catch(err => next(err))
});

///api/Shipment/new
router.post("/new", (req, res, next) => {
    const { creationDate, pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets, author } = req.body;

    Shipment.create({ author, creationDate, pickUpDireccion, pickUpProvince, deliveryDireccion, deliveryProvince, pallets, author })

        .then(response => {
            return Sender.findByIdAndUpdate(author, { $push: { createdShipments: response._id } }, { new: true })
        })

        .then(response => {
            console.log(response)
            res.json(response)
        })
        .catch(err => next(err))
});



router.put("/edit/:idShipment", (req, res, next) => {
    const { idShipment } = req.params;
    const { state, transportists } = req.body

    Shipment.findByIdAndUpdate(idShipment, req.body, { new: true })
        .then(result => {


            res.json(result)
        })
        .catch(err => console.log(err))

});


router.delete("/delete/:id", (req, res, next) => {
    const { idShipment } = req.params;
    Shipment.findByIdAndDelete(idShipment)
        .then(result => {
            res.json({ resultado: "ok" });
        })
        .catch(err => next(err))
});


router.get("/:idShipment", (req, res, next) => {
    const { idShipment } = req.params;
    Shipment.findById(idShipment)
        .populate("transportists")
        .populate("author")
        .then(result => {
            console.log("RESULT: ", result);
            res.json(result);
        })
        .catch(err => next(err))
});




module.exports = router;
