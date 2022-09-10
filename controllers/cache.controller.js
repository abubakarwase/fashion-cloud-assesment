// @desc    Get cache
// @route   GET /api/v1/caches/:key
// @access  Public
exports.getCache = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "cached data",
  });
};