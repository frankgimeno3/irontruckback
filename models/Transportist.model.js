const { Schema, model } = require("mongoose");

const transportistSchema = new Schema(

    {

        email: {
            type: String,
            // required: [true, "Email is required."],
            unique: true,
            lowercase: true,
            trim: true,
        },

        name: {
            type: String,
            required: [true, "Name is required."],
        },

        password: {
            type: String,
            required: [true, "Password is required."],
        },

        phoneNumber: {
            type: String,
            required: [true, "Phone Number is required"],
        },

        licensePlate: {
            type: String,
            // required: [true, "License Plate is required"],
        },

        professionaltype: {
            type: String,
            enum: ["Company", "Autonomous"],
            // required: [true, " Profesional Type is required."]
        },

        company: {
            type: String
        },


        nif: {
            type: String,
            // required: true,
        },
        image: {
            type: String,
            default: "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/6192175/truck-driver-clipart-md.png",
          },
       isTransportist:{
            type: Boolean,
            default: true,
          },

        savedShipments: { type: [Schema.Types.ObjectId], ref: "Shipment" },

        currentShipments: { type: [Schema.Types.ObjectId], ref: "Shipment" },

        completedShipments: { type: [Schema.Types.ObjectId], ref: "Shipment" },

        rejectedShipments: { type: [Schema.Types.ObjectId], ref: "Shipment" },

        isAdmin: {
            type: Boolean,
            default: false,
        }
        
    },



    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Transportista = model("Transportist", transportistSchema);

module.exports = Transportista;