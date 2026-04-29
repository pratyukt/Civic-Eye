import mongoose from "mongoose";

const parentAreaSchema = new mongoose.Schema({
  areaCode: {
    type: String,
    required: true,
    trim: true,
  },
  areaName: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["state", "district", "tehsil", "village", "town", "city"],
    required: true,
    lowercase: true,
  },
}, { _id: false }); // no separate _id for subdocument

const areaSchema = new mongoose.Schema(
  {
    areaName: {
      type: String,
      required: true,
      trim: true,
    },
    tehsil: {
      type: String,
      required: true,
      trim: true,
    },
    population: {
      type: Number,
      default: 0,
    },
    areaCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["village", "town", "city", "tehsil", "district", "state"],
      required: true,
      lowercase: true,
    },
    pinCode: {
      type: Number,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    boundaryCoordinates: {
      type: Array,
      default: [],
    },
    households: {
      type: Number,
      default: 0,
    },
    officialLanguage: {
      type: String,
      default: "Hindi",
    },
    wardNumber: {
      type: Number,
      default: null,
    },
    policeStation: {
      type: String,
    },
    postOffice: {
      type: String,
    },
    parentArea: {
      type: parentAreaSchema,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      default: "system",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Area = mongoose.model("Area", areaSchema);

export default Area;
