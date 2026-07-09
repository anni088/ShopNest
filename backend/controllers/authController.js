// const user = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const User = require('../model/User');
const { model } = require('mongoose');

const OTP_TTL_MS = 10 * 60 * 1000;

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '30d'});
};


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


//Verification
const otpVerification = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }
        
        const existingUser = await User.findOne({email});
        if(existingUser && existingUser.verified) {
            return res.status(400).json({ message: 'user already exists'});
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + OTP_TTL_MS);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

         if (existingUser) {
            // Previously started but never verified — refresh their details/OTP
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.otp = otp;
            existingUser.otpExpiry = otpExpiry;
            await existingUser.save();
        } else {
            await User.create({
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpiry,
                verified: false
            });
        }

        const message = `
        Welcome to ShopNest ${name},
        Your OTP for ShopNest registration is : ${otp}
        This code expires in 10 minutes.
        `;

        await sendEmail(email, 'Welcome to ShopNest - Your OTP for Registration', message);
        
        res.status(201).json({ message: 'OTP sent to your email' });

    } catch (error) {
        console.log(error);
        res.status(502).json({ message: 'otp not sent'});
    }
}



// Registration
const registerUser = async (req, res) => {
     try {
        const { email, otp } = req.body;
 
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
 
        const user = await User.findOne({ email }).select('+otp +otpExpiry');
 
        if (!user) {
            return res.status(400).json({ message: 'No pending registration found for this email' });
        }
 
        if (user.verified) {
            return res.status(400).json({ message: 'User already verified. Please log in.' });
        }
 
        if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }
 
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
 
        user.verified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
 
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});

         if (!user || !user.verified) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        if(await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message : 'Invalid username or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



const getUser = async (req, res) => {
    try {
        const users = await     User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error - get user' });
    }
};

module.exports = {registerUser, loginUser, getUser, otpVerification}; 