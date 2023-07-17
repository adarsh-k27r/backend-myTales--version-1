const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('./middleware/fetchuser');

const JWT_token = "adarshis$boy";

// ROUTE 1: create a User using: POST "/api/auth/createuser". No login required.

router.post('/createuser', [
    body('email', 'Empty email').notEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'Invalid password').notEmpty(),
    body('password', 'Password shall be at least 8 chars long').isLength({ min: 8 }),
    body('name', 'Empty name').notEmpty()
], async (req, res) => {
    let success=false;

    const {name,email} = req.body;



    //returns any bad requests or error.
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({errors: result.array()});
    }

    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "User already exists" });
        }

        const salt = bcrypt.genSaltSync(10);
        const secPass = bcrypt.hashSync(req.body.password, salt);

        //create a new user.
        user = await User.create({
            name: name,
            email: email,
            password: secPass
        })

        const data = {
            id: user.id
        }


        const authtoken = jwt.sign(data, JWT_token);
        success=true;

        res.json({success, authtoken });




    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }

})


//ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required.

router.post('/login', [
    body('email', 'Empty email').notEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password can not be blank').notEmpty(),
    body('password', 'Password shall be at least 8 chars long').isLength({ min: 8 }),
], async (req, res) => {
    let success=false;

    //returns any bad requests or error.
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success, error: "Please enter correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({success, error: "Please enter correct credentials" });
        }

        const data = {
            id: user.id
        }

        const authtoken = jwt.sign(data, JWT_token);
        success=true;
        res.json({success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }


})

//ROUTE 3: Get loggedin User detail using: POST "/api/auth/getuser". Login required.

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.userid;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }

})


module.exports = router;

