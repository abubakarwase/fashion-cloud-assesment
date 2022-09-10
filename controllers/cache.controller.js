const Cache = require("../models/cache.model");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create cache
// @route   GET /api/v1/caches/:key
// @access  Public
exports.getCache = asyncHandler(async (req, res, next) => {
  const { key } = req.params;
  const isCache = await Cache.find({ key }).exec();

  if (!isCache.length) {
    const caches = await Cache.find({}).exec();
    if (caches.length >= Number(process.env.CACHE_POOL)) {
      const tempCache = await Cache.find({})
        .sort({ demand: 1, createdAt: 1 })
        .limit(1)
        .exec();
      const tempId = tempCache[0]._id;

      await Cache.deleteOne({ _id: tempId });
    }
    console.log(`Cache miss`.brightRed.bold);
    const cache = await Cache.create({ key });
    return res.status(201).json({
      success: true,
      data: cache,
    });
  } else {
    const updatedCache = await Cache.findOneAndUpdate(
      { key },
      { $inc: { demand: 1 } },
      { new: true }
    ).exec();
    console.log(`Cache hit`.brightGreen.bold);
    return res.status(201).json({
      success: true,
      data: updatedCache,
    });
  }
});

// @desc    Get a cache
// @route   GET /api/v1/caches/:key/retrieve
// @access  Public
exports.getCacheRetrieve = asyncHandler(async (req, res, next) => {
  const { key } = req.params;
  const cache = await Cache.find({ key }).exec();

  if (!cache.length) {
    return next(new ErrorResponse(`Cache not found with key of ${key}`, 404));
  }
  return res.status(200).json({
    success: true,
    data: [...cache],
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
    await Cache.remove();
  
    return res.status(200).json({
      success: true,
      data: {},
    });
  });