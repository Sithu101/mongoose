require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const fileUpload = require("express-fileupload");

mongoose.connect(process.env.DB_URL);

app.use(express.static( "public"));
app.use(express.json());
app.use(fileUpload());

const userRouter = require("./routers/user");

app.use("/users", userRouter);

app.use((err, req, res, next) => {
  res.status(500).json({
    condition: false,
    message: "Something went wrong",
    error: err.message,
  });
});

const { saveSingle } = require("./utils/gallery");

app.post("/image", saveSingle, (req, res, next) => {
    res.json({ con: true, link: req.imageLink });
});

app.listen(process.env.PORT, () => {
  console.clear();
  console.log(`Server is running on port ${process.env.PORT}`);
});
