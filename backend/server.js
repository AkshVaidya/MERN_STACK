const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const transactionRoutes = require("./routes/transactions");
const statisticsRoutes = require("./routes/statistics");
const morgan = require("morgan");

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
app.use(morgan("tiny"));
app.use(express.json());

const url = process.env.MONGO_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("DB Connection error: ", err);
  });

app.use("/api/transactions", transactionRoutes);
app.use("/api/statistics", statisticsRoutes);

app.get("/", (req, res, next) => {
  res.send("Hello World");
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
