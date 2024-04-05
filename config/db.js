require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB Conected");
  })
  .catch((err) => {
    console.log(err);
  });
