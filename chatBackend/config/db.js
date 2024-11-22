const { connect } = require("mongoose");
const colors = require("colors");
const connectDb = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log("mongo connected".yellow.bold);
  } catch (error) {
    console.log("error from mongo", error);
    process.exit();
  }
};

module.exports = connectDb;
