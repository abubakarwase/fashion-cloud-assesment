const mongoose = require("mongoose");
const crypto = require("crypto");

const CacheSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, "Please add a key"],
  },
  value: {
    type: String,
  },
  expiresOn: {
    type: Date,
    expires: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cache", CacheSchema);
