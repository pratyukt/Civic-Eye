import mongoose from "mongoose";

const { Schema } = mongoose;

const UsersSchema = new Schema(
{
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    credit:{
        type:Number,
        required: true,
        min: [1, "Credit must be at least 1"],
        max: [10, "Credit cannot be more than 10"],
    },
    role: {
        type: String,
        enum: ['user']
    },
},
{
    timestamps: true, 
}
)

const User = mongoose.model("User", UsersSchema)

export default User;



