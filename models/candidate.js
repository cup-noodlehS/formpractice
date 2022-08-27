const mongoose = require("mongoose");

const candidatesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
  position: {
    type: String,
    lowercase: true,
    enum: ["president", "vice-president", "senator"],
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("candidate", candidatesSchema);
