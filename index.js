const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const monumentRouter = require("./routes/monument");
const tripRouter = require("./routes/trip");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", authRouter);
app.use("/monument", monumentRouter);
app.use("/trip", tripRouter);

const DB = process.env.DB_CONNECTION;

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log("Error in connecting DB", err);
  });

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}

module.exports = app;
