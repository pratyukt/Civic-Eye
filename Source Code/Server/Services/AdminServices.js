import Admin from "../Models/Admin.js"

const AdminService = {}

AdminService.getAdminByEmail = async(email)=>{
    try{       
        const userData = await Admin.findOne({email})
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
                msg:"Admin Not Found With Given Email",
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
export default AdminService;