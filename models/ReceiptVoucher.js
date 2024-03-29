const mongoose = require('mongoose');

const ReceiptInvoiceSchema = new mongoose.Schema({
    
    userEmail:{type: String},
    inputList:{ type: Array },
    fullAmount:{ type: Number },
    totalPaid:{ type: Number },
    amount:{ type: Number },
    phoneNo:{ type: Number },
    email:{type: String},
    memo:{type: String},
    project:{type: String},
    address:{type: String},
    city:{type: String},
    reference:{type: String},
    journalDate: {type: Date},
    journalNo: {type: String},
    name: {type: String},
    desc: {type: String},
    attachment: {type: Buffer},
    type:{type: String, required: true},

},{timestamps:true});

mongoose.models={}
export default mongoose.model("ReceiptInvoice", ReceiptInvoiceSchema);