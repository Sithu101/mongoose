require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.connect(process.env.DB_URL);

app.use(express.json());


const userRouter = require('./routers/user');

app.use('/users', userRouter);

app.listen(process.env.PORT, () => {
    console.clear();
    console.log(`Server is running on port ${process.env.PORT}`);
});