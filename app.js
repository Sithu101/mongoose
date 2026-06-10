require('dotenv').config();
const express = require('express');
const app = express();
mongoose.connect(process.env.DB_URL);



app.listen(process.env.PORT, () => {
    console.clear();
    console.log(`Server is running on port ${process.env.PORT}`);
});