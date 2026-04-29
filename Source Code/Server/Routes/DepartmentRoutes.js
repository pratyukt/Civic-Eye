import express from "express"
import departmentControllers from "../Controllers/departmentControllers.js"
import { verifyDepartmentToken } from "../middleware/verifyDeptToken.js"
import areaControllers from "../Controllers/areaControllers.js"

const deptroute  = express.Router()

deptroute.post("/signup",departmentControllers.signup)
deptroute.post("/login",departmentControllers.login)
// deptroute.post("/refresh",verifyDepartmentToken,departmentControllers.refresh)
deptroute.get("/get-all-state-of-department",departmentControllers.getAllState)
deptroute.get("/get-all-districts-of-state",departmentControllers.getAllDistrictsOfState)
deptroute.get("/get-all-department-of-district",departmentControllers.getAllDepartmentOfDistrict)

deptroute.get("/get-department-info",departmentControllers.getDepartmenInfo)

//area routes
deptroute.get("/get-area-by-state-and-district",areaControllers.getAreaByStateAndDistrict)  


// reject complain 

deptroute.post("/reject-complain",departmentControllers.rejectComplain)
deptroute.post("/active-complain",departmentControllers.activeComplain)
deptroute.post("/resolved-complain",departmentControllers.resolvedComplain)

export default deptroute ;
