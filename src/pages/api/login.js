import User from 'models/User'
import connectDb from 'middleware/mongoose'
import Employees from 'models/Employees';
// Crypto JS
var CryptoJS = require("crypto-js");
// Jwt token
var jwt = require('jsonwebtoken');


const handler = async (req,res)=>{
    if (req.method == 'POST'){
        let user = await User.findOne({"email": req.body.email})
        if (user){
            // Decryptpassword
            // var bytes  = CryptoJS.AES.decrypt(user.password, process.env.CRYPTOJS_SECRET);
            // var encryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

            if (req.body.email === user.email && req.body.password === user.password){
                let token = jwt.sign({ email:user.email, name:user.name}, process.env.JWT_SECRET);
                res.status(200).json({ success: true, message: "Succesfully Log In!", token, email:user.email, businessName: user.businessName, department: 'Admin' })
            }
            else{
                res.status(400).json({ success: false, message: "Invalid Credentials!" })
            }
        }
        else{
            res.status(400).json({ success: false, message: "User not found!" })
        }
    }
    else{
        res.status(400).json({ success: false, message: "Internal Server Error!" }) 
    }
}

export default connectDb(handler);