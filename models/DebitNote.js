const mongoose = require('mongoose');

const DebitNoteInvoiceSchema = new mongoose.Schema({

    userEmail:{type: String},
    billNo: {type: String}, 
    inputList:{ type: Array },
    totalAmount:{ type: Number },
    fullTax:{ type: Number },
    fullAmount:{ type: Number },
    phoneNo:{ type: Number },
    email:{type: String},
    project:{type: String},
    fromAccount:{type: String},
    receivedBy:{type: String},
    memo:{type: String},
    amount:{type: Number},
    address:{type: String},
    city:{type: String},
    journalDate: {type: Date},
    dueDate: {type: Date},
    name: {type: String},
    desc: {type: String},
    attachment: {type: Buffer},
    type:{type: String, required: true},

},{timestamps:true});

mongoose.models={}
export default mongoose.model("DebitNoteInoice", DebitNoteInvoiceSchema);