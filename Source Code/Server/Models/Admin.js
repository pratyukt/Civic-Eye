import mongoose from "mongoose";

const { Schema } = mongoose;

const AdminsSchema = new Schema(
{
    email: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true
    },
},
{
    timestamps: true, 
}
)

const Admin = mongoose.model("Admin", AdminsSchema)

export default Admin;



