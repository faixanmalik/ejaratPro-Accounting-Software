const mongoose = require('mongoose');

const ChequeSchema = new mongoose.Schema({
    
    userEmail:{type: String},
    inputList:{ type: Array },
    fullAmount:{ type: Number },
    totalPaid:{ type: Number },
    fullTax:{ type: Number },
    chqNo:{ type: Number },
    discount:{ type: Number },
    totalAmount:{ type: Number },
    phoneNo:{ type: Number },
    email:{type: String},
    fromAccount:{type: String},
    receivedBy:{type: String},
    memo:{type: String},
    project:{type: String},
    address:{type: String},
    city:{type: String},
    journalDate: {type: Date},
    dueDate: {type: Date},
    journalNo: {type: String},
    name: {type: String},
    desc: {type: String},
    attachment: {type: Buffer},
    type:{type: String},
    chequeStatus:{type: String, default: 'Received'},

},{timestamps:true});

mongoose.models={}
export default mongoose.model("Cheque", ChequeSchema);