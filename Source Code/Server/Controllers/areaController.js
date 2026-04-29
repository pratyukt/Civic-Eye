import express from "express";
import AreaServices from "../Services/AreaServices.js";
import { getAreaSchema } from "../Validations/AreaValidation.js";
import { getWardSchema } from "../Validations/AreaValidation.js";

const areaController = {};

areaController.getTypes = async (req,res)=>{
    try{
        const data = await AreaServices.getDistinctTypesWithWardStatus();
        console.log("hello")
        return res.status(200).send({
            status:"OK",
            msg:"sucessfully find all types",
            data:data
        })
    }catch(err){
        res.status(500).send({
            status: "ERR",
            msg: `error in server to get all areaController, ${err.message}`,
            data: [],
          });
    }
}


areaController.getAllAreaByDistrict = async (req,res)=>{
    try{
        const { value , error } = getAreaSchema.validate(req.body);
        if (error) {
            return res.status(400).send(
              { status:"ERR",
                msg: error.details[0].message,
                data:[]
              });
          }
          const response = await AreaServices.getAllAreasByDistrict(req.body);
          if(response.status =="OK"){
            return res.status(200).send(response)

          }else{
            return res.status(400).send(response)
          }
          
    }catch(err){
        return res.status(500).send({
            status:"ERR",
            msg:`server err at areacontroller getAllAreaByDistrict ${err.message}`,
            data:[]
        })
    }
}
areaController.getAllWardByDistrict=async(req,res)=>{
    try {
        const {value,error}=getWardSchema.validate(req.body);
        if(error){
            return res.status(400).send(
                { status:"ERR",
                  msg: error.details[0].message,
                  data:[]
                });
        }
        const response = await AreaServices.getAllWardByDistrict(req.body);
        if(response.status =="OK"){
            console.log(response.data.length)
            return res.status(200).send(response)

          }else{
            return res.status(400).send(response)
          }
    } catch (error) {
        return res.status(500).send({
            status:"ERR",
            msg:`server err at areacontroller getAllAreaByDistrict ${err.message}`,
            data:[]
        })
    }
}

export default areaController;