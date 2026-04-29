import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const DepartmentSchema = new Schema({
  departmentId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  DepartmentName: {
    type: String,
    required: true
    
  },
  DepartmentShortName: {
    type: String,
    required: true,
   
  },
  HeadOfDepartment:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
   
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  deptAddress:{
    type:String,
    required: true,
  },
  solve_issue: {
    type: [String],
    default: []
  },
  role: {
    type: String,
    enum: ['department'],
    default: 'department'
  },
  isVerified: {
    type: Boolean,
    default: false  
  }
}, {
  timestamps: true,
});

const Department = mongoose.model("Department", DepartmentSchema);

export default Department;
