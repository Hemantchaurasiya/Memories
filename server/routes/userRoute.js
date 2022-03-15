const express = require("express");
const userRouter = express.Router();

const {register,login} = require("../controllers/userController");

// register the new user
userRouter.post("/signup",register);

// login the user
userRouter.post("/signin",login);

module.exports = userRouter;