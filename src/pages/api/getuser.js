import connectDb from 'middleware/mongoose'
import User from 'models/User';

// Jwt token
var jwt = require('jsonwebtoken');

const handler = async (req,res)=>{

    if (req.method == 'POST'){
        
        let token = req.body.token;
        let user = jwt.verify(token, process.env.JWT_SECRET);
        let dbuser = await User.findOne({"email": user.email})
        if(dbuser){
            // working
            res.status(200).json({ success: true , dbuser })
        }
        else{
            res.status(400).json({ success: false , message: "No user Found!" })
        }
    }
    else{
        res.status(400).json({ success: false , message: "Internal Server Error!" })
    }

}
export default connectDb(handler);