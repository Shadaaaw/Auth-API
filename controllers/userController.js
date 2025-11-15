const User = require('../models/user');
const VerificationToken = require('../models/verificationToken');
const appError = require('../utils/appError');
const asyncWrapper = require('../utils/asyncWrapper');
const bcrypt = require('bcrypt');
const httpStatusText = require('../utils/httpStatusText');
const generateJWT = require('../utils/generateJWT');
const mongoose = require('mongoose');
const sendEmail = require('../config/email');

const register = asyncWrapper(async (req, res, next) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return next(appError.create(
            'All fields must be provided',
            httpStatusText.ERROR,
            400
        ))
    }

    const checkUser = await User.findOne({email: email});
    if(checkUser){
        return next(appError.create(
            `User with ${email} already exist`,
            httpStatusText.ERROR,
            400
        ))
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    const token = await generateJWT({id: user._id, email : user.email, verified : user.verified});
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);

    await VerificationToken.create({
        userId: user._id,
        code: hashedCode,
        type: "email",
        expiresAt : new Date(Date.now() + 20 * 60 * 1000) //20min
    });

    await sendEmail(
        user.email,
        'Email verification code',
        `Your code : ${code}, it expires after 20min`
    );

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        message: 'User registered successfully, code verification sent !',
        data: {token}
    });
});

const sendVerificationCode = asyncWrapper(async (req, res, next) => {
    await VerificationToken.deleteMany({ userId: req.user.id, type: "email" });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    await VerificationToken.create({
        userId: req.user.id,
        code: hashedCode,
        type: "email",
        expiresAt : new Date(Date.now() + 20 * 60 * 1000) //20min
    });

    await sendEmail(
        req.user.email,
        'Email verification code',
        `Your code : ${code}, it expires after 20min`
    );

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        message: 'Code verification sent !',
        data: {}
    });
});

const login = asyncWrapper(async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return next(appError.create(
            'All fields must be provided',
            httpStatusText.ERROR,
            400
        ));
    }

    const user = await User.findOne({email: email}).select('+password');
    if(!user){
        return next(appError.create(
            `User with ${email} does not exist`,
            httpStatusText.ERROR,
            404
        ));
    }
    const matchedPassword = await bcrypt.compare(password, user.password);
    if(!matchedPassword){
        return next(appError.create(
            'Credentials does not match',
            httpStatusText.ERROR,
            401
        ))
    }

    const token = await generateJWT({id: user._id, email : user.email, verified : user.verified});


    res.status(200).json({
        status: httpStatusText.SUCCESS,
        message: 'User logged in successfully',
        data: {token}
    })
});


module.exports = {
    register,
    sendVerificationCode,
    login
}