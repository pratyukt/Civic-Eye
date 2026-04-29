import AreaServices from "../Services/AreaServices.js";

const areaControllers = {};

areaControllers.getAreaByStateAndDistrict = async (req, res) => {
 try {
     const { state, district } = req.query;
  if (!district || !state) {
      return res.status(400).send({
        status: "ERR",
        msg: "district and state is required in query param",
        data: [],
      });
    }
  const area = await AreaServices.getAreaByStateAndDistrict(state, district);
  if(area.status=="ERR"){
      res.status(500).send(area);
    }else{
      res.status(200).send(area)
    }
} catch (err) {
  res.status(500).send({
    status: "ERR",
    msg: `error in server while getting getAreaByStateAndDistrict ${err.message}`,
    data: [],
  });
}
};

export default areaControllers;