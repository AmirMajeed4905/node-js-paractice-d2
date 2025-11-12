const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/userController");

// Routes
router.post("/user/register", registerUser);
router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports = router;
