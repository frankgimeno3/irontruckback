const { Schema, model } = require("mongoose");
const Shipment = require('./Shipment.model');

// TODO: Please make sure you edit the Sender model to whatever makes sense in this case
const senderSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    image: {
      type: String,
      default: "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/6192175/truck-driver-clipart-md.png",
    },

    phoneNumber: {
      type: Number,
      required: [true, "Phone Number is required."],
      unique: true
    },

    address: {
      type: String,
      required: [true, "Direccion is required."]
    },


    createdShipments: [{ type: Schema.Types.ObjectId, ref: "Shipment" }],

    inNegotitationShipments: [{ type: Schema.Types.ObjectId, ref: "Shipment" }],

    completedShipments: [{ type: Schema.Types.ObjectId, ref: "Shipment" }],

    rejectedShipments: [{ type: Schema.Types.ObjectId, ref: "Shipment" }],

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

const Sender = model("Sender", senderSchema);

module.exports = Sender;
