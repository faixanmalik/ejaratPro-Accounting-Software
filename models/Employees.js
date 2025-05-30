const mongoose = require('mongoose');

const EmployeesSchema = new mongoose.Schema({

    userEmail:{type: String},
    name:{type: String},
    fatherName:{type: String},
    dob:{type: Date},
    email:{type: String},
    password:{type: String, default: 12},
    cnic:{type: Number},
    phoneNo:{type: Number},
    citizenship:{type: String},
    gender:{type: String},
    maritalStatus:{type: String},
    designation:{type: String},
    department:{type: String},
    workShift:{type: String},
    workHour:{type: Number},
    employmentMode:{type: String},
    payPolicy:{type: String},
    basicPay:{type: Number},
    paymentMode:{type: String},
    status:{type: String},
    hireDate:{type: Date},
    siteName:{type: String},
    joiningDate:{type: Date},
    country:{type: String},
    streetAddress:{type: String},
    city:{type: String},
    state:{type: String},
    zip:{type: Number},
    
  },{timestamps:true});

mongoose.models={}
export default mongoose.model("Employees", EmployeesSchema);