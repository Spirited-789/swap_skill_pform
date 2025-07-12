const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/userController");
const {searchUsers} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/get-profile",getUserProfile);
router.put("/update-profile",updateUserProfile);
router.get("/search", searchUsers); // e.g., /api/users/search?term=React&skill=Node.js&availability=Available

module.exports = router;
