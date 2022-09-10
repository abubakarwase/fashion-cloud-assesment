const express = require("express");
const router = express.Router();

const {
  getCache,
  getCacheRetrieve,
  getCacheList,
  updateCache,
  deleteCache,
  deleteAllCache,
} = require("../controllers/cache.controller");

router.route("/:key").get(getCache).put(updateCache).delete(deleteCache);

router.route("/:key/retrieve").get(getCacheRetrieve);

router.route("/").get(getCacheList).delete(deleteAllCache);

module.exports = router;
