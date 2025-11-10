const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,   // optional but recommended
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    resettoken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // ✅ Correct position — outside the field list
  }
);

// 🧠 Create and export model
module.exports = mongoose.model("User", userSchema);

