const User = require("../model/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config()
var nodemailer = require('nodemailer');
var randomString = require('random-string')
const express = require('express');

const router = express.Router();


// Register
router.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const { firstName, lastName, email, password } = req.body;

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedUserPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(), // sanitize
            password: encryptedUserPassword,
            random_string: "abc"
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "5h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});


// Login
router.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "5h",
                }
            );

            // save user token

            user.token = token;

            // verification mail

            var x = randomString();

            // default string

             var examplestring = "abcDE1"

            // Create random string in our database

            var _id = user._id

            const user1 = await User.findByIdAndUpdate({ _id }, { $set: { random_string: examplestring } }, { returnNewDocument: true, new: true })

            // to send mail

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'm.rajeshmanohar@gmail.com',
                    pass: 'hpyzqgqjtzjrzzyz'
                }
            });

            var mailOptions = {
                from: 'm.rajeshmanohar@gmail.com',
                to: 'm.rajeshmanohar@gmail.com',
                subject: 'Sending Email using Node.js',
                html: `<h1>Enter this OTP : ${x}</h1>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            // user
            return res.status(200).json({ user, message: "Loggedin" });
        }
        return res.send('Invalid');

        // Our login logic ends here
    }
    catch (err) {
        console.log(err)
    }
});


// OTP
router.post("/otp", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, OTP } = req.body;


        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (OTP === user.random_string) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "5h",
                }
            );

            // save user token
            user.token = token;

            // user
            return res.status(200).json({ user, message: "Loggedin" });
        }
        return res.send('Invalid');

        // Our login logic ends here
    }
    catch (err) {
        console.log(err)
    }
});

// set new password 

router.post("/setnewpassword", async function (req, res) {
    try {
        const { email, password } = req.body;

        const NoUser = await User.findOne({ email });

        if (!NoUser) {
            return res.send({ message: 'Sorry Email does not Exist!' });
        }

        // Create random string in our database
        var _id = NoUser._id
        encryptedUserPassword = await bcrypt.hash(password, 10);

        const user1 = await User.findByIdAndUpdate({ _id }, { $set: { password: encryptedUserPassword, random_string: "" } }, { returnNewDocument: true, new: true })

        res.send(user1)
    }
    catch (err) {
        console.log(err)
    }
});

// to get registered user name

router.get("/getusersname", async function (req, res) {
    try {

        const name = await User.aggregate([
            {
                $project: {
                    first_name: 1,
                    last_name: 1
                }
            }
        ])
        res.send(name)

    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router;