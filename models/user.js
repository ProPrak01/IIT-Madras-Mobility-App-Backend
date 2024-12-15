const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  number : {
      required: true,
      type: Number,
      unique: true,
      // validate: {
      //     validator: (value) => /^[0-9]{10}$/.test(value),
      //     message: "Please enter a valid mobile number",
      // },
  },
}, { versionKey: false });

  const User = mongoose.model("User", userSchema);

  module.exports = { User };