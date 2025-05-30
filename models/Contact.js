const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({

    userEmail:{type: String},
    name:{type: String},
    type:{type: String},
    accounts:{type: String},
    email:{type: String},
    phoneNo:{type: Number},
    secondaryEmail:{type: String},
    secondaryPhoneNo:{type: Number},
    country:{type: String},
    streetAddress: {type: String},
    city: {type: String},
    state: {type: String},
    zip: {type: Number},
    taxRigNo: {type: Number},
    paymentMethod: {type: String},
    terms: {type: String},
    openingBalance: {type: Number},
    date: {type: Date}
    

  },{timestamps:true});

mongoose.models={}
export default mongoose.model("Contact", ContactSchema);