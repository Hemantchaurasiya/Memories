const express = require("express");
const cors = require("cors");
const DbConnect = require('./database');
require('dotenv').config();
const app = express();

const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRoute");

// middlewares
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());


// database connection
DbConnect();
const PORT = process.env.PORT;

// routes
app.use("/user", userRouter);
app.use('/posts', postRouter);


// server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));