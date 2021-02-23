const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/isAuth");
const usersController = require("../controllers/users");

const router = express.Router();

const emailValidator = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Email Address is not valid.");
const passwordValidator = body("password")
  .trim()
  .isLength({ min: 6 })
  .withMessage("Password has to be 6 chars or more.");
const nameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required.");

// POST /users/signup
router.post(
  "/signup",
  [emailValidator, passwordValidator, nameValidator],
  usersController.signup
);

// POST /users/login
router.post(
  "/login",
  [emailValidator, passwordValidator],
  usersController.login
);

// POST /users/login
router.post(
  "/login2",
  [emailValidator, passwordValidator],
  usersController.login2
);

// POST /users/googlogin
router.post(
  "/googlogin",
  [emailValidator, passwordValidator],
  usersController.googlogin
);

// POST /users/logout
router.post("/logout", isAuth, usersController.logout);

// GET /users/account
router.get("/account", isAuth, usersController.getUser);

// PUT /users/account/inbox
router.put("/account/inbox", isAuth, usersController.updateInbox);

// PUT /users/account
router.put("/account", isAuth, usersController.updateUser);

// POST /users/resetToken
router.post("/resetToken", [emailValidator], usersController.getResetToken);

// POST /users/resetPassword
router.post(
  "/resetPassword",
  [passwordValidator],
  usersController.resetPassword
);

// POST /users/activate
router.post("/activate", usersController.activateAccount);

module.exports = router;
