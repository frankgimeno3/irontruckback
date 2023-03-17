const { Schema, model } = require("mongoose");

const shipmentSchema = new Schema(

    {
        author: {
            type: Schema.Types.ObjectId, ref: "Sender"
        },

        creationDate: {
            type: Date,
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
        transportists: [{
            type: Schema.Types.ObjectId, ref: "Transportist"
        }],


        state: {
            enum: ["Created", "inNegotiation", "Completed"],
            default: "Created",
            type: String
        }


    },

    {
        timestamps: true,

    }
);

const Shipment = model("Shipment", shipmentSchema);

module.exports = Shipment;
