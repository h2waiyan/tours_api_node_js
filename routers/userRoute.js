const express = require("express");
const userCtrl = require("../controllers/userCtrl");
const authCtrl = require("../controllers/authCtrl");

const userRouter = express.Router();

userRouter.route("/getall").get(authCtrl.getAllUsers);
// userRouter
//   .route("/:id")
//   .get(userCtrl.getOneUser)
//   .patch(userCtrl.updateOneUser)
//   .delete(userCtrl.deleteOneUser);

userRouter.post("/forgotpassword", authCtrl.forgotPassword);
userRouter.post("/resetpassword/:token", authCtrl.resetPassword);

userRouter.route("/login").post(authCtrl.login); // get one user
userRouter.route("/register").post(authCtrl.register); // add new user

module.exports = userRouter;
