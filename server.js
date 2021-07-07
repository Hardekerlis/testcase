const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

// General middlewares
app.use(bodyParser.json({
  limit: "5mb" // Limit request size
}));


const registerRouter = require("./src/routes/register");
// -- Routes --
app.use(registerRouter);


// -- Start app --
// Port should be put into config file..
app.listen(3000, () => {
  console.log("Listening on port *:3000");
});
