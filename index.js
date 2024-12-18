const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const monumentRouter = require("./routes/monument");
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/user',authRouter);
app.use('/monument',monumentRouter);

const DB = process.env.DB_CONNECTION;

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log("Error in connecting DB",err);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});