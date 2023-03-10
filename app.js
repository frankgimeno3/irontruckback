// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const ShipmentRoutes = require("./routes/Shipment.routes");
app.use("/api/Shipment", ShipmentRoutes);
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const shipmentRoutes = require("./routes/shipment.routes");
app.use("/api/shipment", shipmentRoutes)

const profileRouter = require('./routes/profile.routes'); // <== has to be added
app.use('/profile', profileRouter); // <== has to be added

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);
 


module.exports = app;
