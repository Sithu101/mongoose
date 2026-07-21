require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const fileUpload = require("express-fileupload");

mongoose.connect(process.env.DB_URL);

app.use(express.static("public"));
app.use(express.json());
app.use(fileUpload());

const userRouter = require("./routers/user");
const catRouter = require("./routers/cat");
const productRoute = require("./routers/product");

app.use("/users", userRouter);
app.use("/cats", catRouter);
app.use("/products", productRoute);

app.use((err, req, res, next) => {
  res.status(500).json({
    condition: false,
    message: "Something went wrong",
    error: err.message,
  });
});

const { saveSingle, saveMultiple } = require("./utils/gallery");

app.post("/image", saveSingle, (req, res, next) => {
  res.json({ con: true, link: req.imageLink });
});

app.post("/images", saveMultiple, (req, res, next) => {
  res.json({ con: true, msg: req.body.images });
});

app.listen(process.env.PORT, () => {
  console.clear();
  // console.log('process.memoryUsage():', process.memoryUsage());
  console.log(`Server is running on port ${process.env.PORT}`);

});
