const mongoose = require('mongoose');

const CreditNoteInvoiceSchema = new mongoose.Schema({

    userEmail:{type: String},
    inputList:{ type: Array },
    contractId:{ type: String },
    fullAmount:{ type: Number },
    fullTax:{ type: Number },
    totalAmount:{ type: Number },
    phoneNo:{ type: Number },
    email:{type: String},
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
    type:{type: String, required: true},

},{timestamps:true});

mongoose.models={}
export default mongoose.model("CreditNoteInvoice", CreditNoteInvoiceSchema);