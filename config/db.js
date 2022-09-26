const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold
  )
};

module.exports = connectDB;
