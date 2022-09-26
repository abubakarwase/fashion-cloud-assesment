const crypto = require("crypto");
const moment = require("moment");

const Cache = require("../models/cache.model");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

async function generateRandomValue() {
  return await crypto.randomBytes(20).toString("hex");
}

async function getOrCreateRecord(key, randomValue) {
  const updateObject = {
    $setOnInsert: {
      key,
      value: randomValue,
    },
    $set: {
      expiresOn: moment().add(process.env.CACHE_TIMEOUT, 'seconds').toDate(),
    },
  };
  const updateOptions = {
    upsert: true,
    new: true,
  };
  return Cache.findOneAndUpdate({ key }, updateObject, updateOptions);
}

async function ensureSpace() {
  const count = await Cache.count();

  if (count < Number(process.env.CACHE_POOL)) {
    return;
  }

  return Cache.findOneAndRemove(
    {},
    {sort: 'expiresOn'}
  );
}

// @desc    Create cache
// @route   GET /api/v1/caches/:key
// @access  Public
exports.getCache = asyncHandler(async (req, res, next) => {
  const { key } = req.params;

  await ensureSpace();

  const randomValue = await generateRandomValue();

  const record = await getOrCreateRecord(key, randomValue);

  if (record.value === randomValue) {
    console.log(`Cache miss`.brightRed.bold);
  } else {
    console.log(`Cache hit`.brightGreen.bold);
  }

  return res.status(201).json({
    success: true,
    data: record,
  });
});

// @desc    Get all cache
// @route   GET /api/v1/caches
// @access  Public
exports.getCacheList = asyncHandler(async (req, res, next) => {
  const { page, limit, sort } = req.query;

  const cache = await Cache.find({})
    .sort({
      createdAt: sort || "-1",
    })
    .select('key value -_id expiresOn')
    .limit(limit || 15)
    .skip((page - 1) * 15)
    .exec();

  return res.status(200).json({
    success: true,
    data: [...cache],
    length: cache.length.toString(),
    limit,
    page,
  });
});

// @desc    Update a cache
// @route   UPDATE /api/v1/caches/:key
// @access  Public
exports.updateCache = asyncHandler(async (req, res, next) => {
  const { key } = req.params;
  const { randomString } = req.body;

  const cache = await Cache.find({ key }).exec();

  if (!cache.length) {
    return next(new ErrorResponse(`Cache not found with key of ${key}`, 404));
  }

  const updatedCache = await Cache.findOneAndUpdate(
    { key },
    { randomString },
    { new: true }
  ).exec();

  return res.status(200).json({
    success: true,
    data: updatedCache,
  });
});

// @desc    Delete a cache
// @route   DELETE /api/v1/caches/:key
// @access  Public
exports.deleteCache = asyncHandler(async (req, res, next) => {
  const { key } = req.params;

  const cache = await Cache.find({ key }).exec();

  if (!cache.length) {
    return next(new ErrorResponse(`Cache not found with key of ${key}`, 404));
  }

  await Cache.deleteOne({ key });

  return res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Delete all cache
// @route   DELETE /api/v1/caches
// @access  Public
exports.deleteAllCache = asyncHandler(async (req, res, next) => {
  await Cache.deleteMany();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
