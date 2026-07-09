const express = require('express');
const router = express.Router();
const {registerUser, loginUser, getUser, otpVerification } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');


router.post("/register", registerUser);
router.post("/otp-verification", otpVerification);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUser);

//video : 2:29:50
router.post("/verify-email", async (req, res) =>{
    const { email } = req.body;
})

module.exports = router; 