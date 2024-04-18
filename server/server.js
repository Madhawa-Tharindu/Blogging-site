import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';

// import schemas below
import User from './Schema/User.js';


const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

//middlewares
server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
});

const generateUserName = async (email) => {
    let username = email.split('@')[0];
    
    let isUserNameNotUnique = await User.exists({ "personal_info.username" : username}).then((result) => result);
    isUserNameNotUnique ? username += nanoid() : "";
    return username;
}

const formatDataToSend = (user) => {
    
    const access_token = jwt.sign({is: user._id}, process.env.SECRET_ACCESS_KEY);

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
    }
}

server.post("/signup", async(req, res) => {
    let { fullname, email, password } = req.body;

    //validating the data from frontend
    if (!fullname || fullname.length < 3){
        return res.status(403).json({"error": "Full Name must be at least 3 characters long"});
    }
    if (!email.length || !email.includes('@') || !email.includes('.')){
        return res.status(403).json({"error": "Email must be type 'email' and cannot be empty"});
    }
    if (!emailRegex.test(email)){
        return res.status(403).json({"error": "Email is not valid"});
    }
    if (!passwordRegex.test(password)){
        return res.status(403).json({"error": "Password should be 6 to 20 characters long with a numeric, at least 1uppercase letter, one lowercase letter, and one number"});
    
    }
    // password hashing function
    bcrypt.hash(password, 10, async(err, hashed_password) => {
        // console.log(err, hashed_password);
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ "error": "Internal server error" });
        }

        let username = await generateUserName(email);

        let user = new User({
            personal_info: {
                fullname: fullname,
                email: email,
                password: hashed_password,
                username: username,
            }
        });

        user.save().then((u) => {
            res.status(200).json(formatDataToSend(user));
        })
        .catch((err) => {
            if(err.code === 11000){
                return res.status(500).json({"error": "Email already exists!"})
            }

            return res.status(500).json({"error": err.message});
        });
   });


    //return res.status(200).json({"message": "User created successfully"});
})

server.post("/login", (req, res) => {
    let { email, password } = req.body;

    User.findOne({"personal_info.email": email}).then((user) => {
        if (!user){
            return res.status(404).json({"error": "Email not found"});
        }

        bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if (err){
                return res.status(403).json({"error": "Error occurred while login. Please Try again!"});
            }

            if (!result){
                return res.status(403).json({"error": "Invalid Password!"});
            }
            else{
                return res.status(200).json(formatDataToSend(user));
            }
        });
    })
    .catch((err) => {
        return res.status(500).json({"error": err.message});
    });
})

server.listen(PORT, () => {
    console.log('listening on port '+ PORT);
})