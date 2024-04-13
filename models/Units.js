const mongoose = require('mongoose');

const UnitsSchema = new mongoose.Schema({

    userEmail:{type: String},
    attachment: String,
    name: String,
    phoneNo: Number,
    email: String,
    nameInBill: String,
    idNumber: Number,
    expID: Date,
    building: String,
    passPortNumber: Number,
    expPassPort: Date,
    buildingNameInArabic: String,
    buildingNameInEnglish: String,
    parkings: Number,
    roof: Number,
    country: String,
    city: String,
    area: String,
    electricityMeterNo: Number,
    contractStartDate: Date,
    investmentStructure: String,
    gracePeriodFrom: Date,
    contractEndDate: Date,
    amount: Number,
    gracePeriodTo: Date,
    paymentScheduling: Number,
    unitNo: Number, // Assuming unitNo is a number
    balcony: Number,
    ac: String,
    unitType: String,
    unitUse: String,
    bathroom: Number,
    unitStatus: String,
    plotNo: Number,
    rent: Number,
    rentParking: Number,
    size: Number,
    waterMeterNumber: Number,
    sewageNumber: Number,
    view: String,
    notes: String,
  },{timestamps:true});

mongoose.models={}
export default mongoose.model("Units", UnitsSchema);