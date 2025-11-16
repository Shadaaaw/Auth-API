const express = require("express");
const router = express.Router();

const { verifyToken} = require('../middlewares/authMiddleware');
const {register, login, sendVerificationCode, verifyEmail} = require('../controllers/userController');

router.post("/login", login);
router.post("/register", register);
router.post("/send-verification-code",verifyToken, sendVerificationCode);
router.patch("/verify-email", verifyToken, verifyEmail);

module.exports = router;

