const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName:{type: String, required: true},
    lastName:{type: String},
    name:{type: String},
    businessName:{type: String, required: true},
    country:{type: String},
    industry:{type: String},
    day:{type: Number },
    month:{type: String},
    phoneno:{type: Number },
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    streetAddress: {type: String },
    state: { type: String  },
    taxRigNo: { type: Number  },
    zip: { type: Number },

    path: { type: String },
    userEmail:{type: String},
    userStatus: { type: String, default: 'Deactivate' },

  },{timestamps:true});
   

mongoose.models = {}
export default mongoose.model("User", UserSchema);