import User from "../Models/User.js"

const UserServices = {}


UserServices.getUserByEmail = async(email)=>{
    try{
        const userData = await User.findOne({email})
        if(userData){
            return {
                status:"OK",
                msg:"User Found Sucessfully",
                data:[
                    userData
                ]
            }
        }else{
            return{
                status:"OK",
                msg:"User Not Found With Given Email",
                data:[]
            }
        }

    }catch(err){
        return {
            status:"ERR",
            msg:err.message,
            data:[]
        }
    }
}

UserServices.signup = async({userName,email,password, mobileNumber,credit,role})=>{
    try{
        const signupData = await User.insertOne({
            userName,
            email,
            password,
            mobileNumber,
            credit,
            role
        })
        return{
            status:"OK",
            msg:"User SignUp SucessFully",
            data:[signupData]
        }
    }catch(err){
        return {
            status:"ERR",
            msg:err.message,
            data:[]
        }
    }
}


export default UserServices;