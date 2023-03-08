const { Schema, model } = require("mongoose");

const transportistaSchema = new Schema(

    {

        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            lowercase: true,
            trim: true,
        },

        username: {
            type: String,
            required: [true, "Name is required."],
        },

        password: {
            type: String,
            required: [true, "Password is required."],
        },

        image: {
            type: String,
        },

        telefono: String,

        matricula: String,

        profesionaltype: {
            type: String,
            enum: ["Company", "Autonomous"],
            required: [true, "Name is required."]

        },

        addres: {
            type: String,
            required: [true]
        },
        NIF: String,

        envios: { type: Schema.Types.ObjectId, ref: "Envio" },

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

const Transportista = model("Comment", transportistSchema);

module.exports = Transportista;