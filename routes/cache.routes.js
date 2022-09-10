const express = require("express");
const router = express.Router();

const { getCache } = require("../controllers/cache.controller");

router
  .route("/:key")
  .get(getCache)

module.exports = router;