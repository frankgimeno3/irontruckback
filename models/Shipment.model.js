const { Schema, model } = require("mongoose");

const shipmentSchema = new Schema(

    {
        author: {
            type: Schema.Types.ObjectId, ref: "Sender"
        },

        creationDate: {
            type: Date,
            required: true
        },

        pickUpDireccion: {
            type: String,
            required: true
        },
        pickUpProvince: {
            type: String,
            required: true
        },
        deliveryDireccion: {
            type: String,
            required: true
        },

        deliveryProvince: {
            type: String,
            required: true
        },
        pallets: {
            type: Number,
            required: true
        },

    },

    {
        timestamps: true,
        timestamps: true,
    }
);

const Shipment = model("Shipment", shipmentSchema);

module.exports = Shipment;
