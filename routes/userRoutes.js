const express = require("express");
const router = express.Router();

const { verifyToken} = require('../middlewares/authMiddleware');
const {register, login, sendVerificationCode} = require('../controllers/userController');

router.post("/login", login);
router.post("/register", register);
router.post("/send-verification-code",verifyToken, sendVerificationCode);

module.exports = router;

