const mongoose = require('mongoose');

const JournalVoucherSchema = new mongoose.Schema({
    
    userEmail:{type: String},
    inputList:{ type: Array },
    totalDebit:{ type: Number },
    totalCredit:{ type: Number },
    memo:{type: String},
    journalDate: {type: Date},
    journalNo: {type: String},
    name: {type: String},
    desc: {type: String},
    attachment: {type: Buffer},
    path:{type: String},
    type:{type: String, default:'JV'},

},{timestamps:true});

mongoose.models={}
export default mongoose.model("JournalVoucher", JournalVoucherSchema);