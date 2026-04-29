import Areas from "../Models/Areas.js";

const AreaServices = {};

AreaServices.getAreaByStateAndDistrict = async (state, district) => {
  try {
    const response = await Areas.find({ state, district, isActive: true });
    return {
      status: "OK",
      msg: "Successfully get all areas in district",
      data: response,
    };
  } catch (err) {
    return {
      status: "ERR",
      msg: err.message,
      data: [],
    };
  }
};
AreaServices.getDistinctTypesWithWardStatus = async () => {
  try {
    const types = await Areas.distinct("type");

    const result = await Promise.all(
      types.map(async (type) => {
        const hasWard = await Areas.exists({
          type,
          wardNumber: { $ne: null },
        });
        return {
          type,
          isWardExists: !!hasWard,
        };
      })
    );
    return result;
  } catch (error) {
    throw new Error("Error fetching types: " + error.message);
  }
};

AreaServices.getAllAreasByDistrict = async ({
  state,
  district,
  type,
  wardNumber,
}) => {
  console.log(wardNumber)
  if (!wardNumber) {
    try {
      const areas = await Areas.find(
        { state, district, type },
        { areaName: 1, _id: 0 } // return only areaName
      );

      return {
        status: "OK",
        msg: "Areas fetched successfully",
        data: areas,
      };
    } catch (error) {
      return {
        status: "ERR",
        msg: error.message,
        data: [],
      };
    }
  }else{
    try {

      const areas = await Areas.find(
        { state, district, type ,wardNumber },
        { areaName: 1, _id: 0 } // return only areaName
      );

      return {
        status: "OK",
        msg: "Areas fetched successfully",
        data: areas,
      };
    } catch (error) {
      return {
        status: "ERR",
        msg: error.message,
        data: [],
      };
    }
  }
};
AreaServices.getAllWardByDistrict = async ({ state, district, type }) => {
  try {
    const wardNumbers = await Areas.distinct("wardNumber", {
      state,
      district,
      type
    });

    return {
      status: "OK",
      msg: "Ward numbers fetched successfully",
      data: wardNumbers
    };

  } catch (error) {
    return {
      status: "ERR",
      msg: error.message,
      data: []
    };
  }
};

export default AreaServices;
