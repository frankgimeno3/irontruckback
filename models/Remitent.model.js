const { Schema, model } = require("mongoose");

const UserSchema = new Schema(

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

        phoneNumber: {
            type: Number,
            required: [true, "Phone Number is required."],
            unique: true


        },

        profesionalType: {
            type: String,
            enum: ["Empresa", "Autonomo"],
            required: [true, "Name is required."]
        },

        direccion: {
            type: String,
            required: [true, "Direccion is required."]
        },


        envios: { type: [Schema.Types.ObjectId], ref: "Envio" },

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

const User = model("Comment", UserSchema);

module.exports = User;