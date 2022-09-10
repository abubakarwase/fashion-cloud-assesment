const mongoose = require("mongoose");
const crypto = require("crypto");

const CacheSchema = new mongoose.Schema({
  key: {
    type: String,
  },
  randomString: {
    type: String,
  },
  demand: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now,
  },
});

// random string generators
CacheSchema.pre("save", async function (next) {
  this.randomString = crypto.randomBytes(20).toString("hex");
  this.demand = 0;
  next();
});

module.exports = mongoose.model("Cache", CacheSchema);
