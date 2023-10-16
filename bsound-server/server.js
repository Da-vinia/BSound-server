const app = require("./app");

const mongoose = require('mongoose');
const express = require('express');

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });

// connect to db
mongoose.connect(process.env.MONG_URI)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`connected to db & Server listening on http://localhost:${PORT}`);
      });
      
    })
    .catch((error) => {
        console.log(error)
    })