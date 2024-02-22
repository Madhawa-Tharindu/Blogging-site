import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';


const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

//middlewares
server.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
});

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
    return res.status(200).json({"message": "User created successfully"});
})

server.listen(PORT, () => {
    console.log('listening on port '+ PORT);
})