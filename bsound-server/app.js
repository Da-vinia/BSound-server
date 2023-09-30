// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const productRoute = require("./routes/product.routes");
app.use("/", productRoute);

const authSignupRouter = require("./routes/auth/signup.routes");       //  <== IMPORT
app.use("/auth", authSignupRouter); 

const authLoginRouter = require("./routes/auth/login.routes");       //  <== IMPORT
app.use("/auth", authLoginRouter); 

const authVerifyRouter = require("./routes/auth/verify.routes");       //  <== IMPORT
app.use("/auth", authVerifyRouter);

const profileRoute = require("./routes/user/profile.routes");
app.use("/profile", profileRoute);

const bookingRoute = require("./routes/booking.routes");
app.use("/booking", bookingRoute);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
