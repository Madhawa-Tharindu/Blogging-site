import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

// import schemas below
import User from './Schema/User.js';


const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

//middlewares
server.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
});

const generateUserName = async (email) => {
    let username = email.split('@')[0];
    
    let isUserNameNotUnique = await User.exists({ "personal_info.username" : username}).then((result) => result);
    isUserNameNotUnique ? username += nanoid() : "";
    return username;
}

server.post("/signup", (req, res) => {
    let { fullName, email, password } = req.body;

    //validating the data from frontend
    if (fullName.length < 3){
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
    bcrypt.hash(password, 10, (err, hashed_password) => {
        // console.log(err, hashed_password);
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ "error": "Internal server error" });
        }

        let username = generateUserName();

        let user = new User({
            personal_info: {
                fullname: fullName,
                email: email,
                password: hashed_password,
                username: username,
            }
        });

        user.save().then((u) => {
            res.status(200).json({user: u})
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

server.listen(PORT, () => {
    console.log('listening on port '+ PORT);
})