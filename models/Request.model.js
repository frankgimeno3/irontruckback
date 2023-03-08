const { Schema, model } = require("mongoose");

const requestSchema = new Schema(
    {

        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId, ref: "Transportist",
        },
        shipment: {
            type: Schema.Types.ObjectId, ref: "Envio",
        },

    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Request = model("Comment", requestSchema);

module.exports = Request;
