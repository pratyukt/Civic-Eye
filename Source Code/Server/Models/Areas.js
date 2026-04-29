import mongoose from 'mongoose';

const { Schema } = mongoose;

const AreasSchema = new Schema({
    areaName: {
        type: String,
        required: true,
    },
    tehsil: {
        type: String,
        required: true,
    },
    population: {
        type: Number,
        required: true,
    },
    areaCode: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true, 
    },
    longitude: {
        type: Number,
        required: true,
    },
    boundaryCoordinates: {
        type: [[Number]], 
        default: []
    },
    households: {
        type: Number,
        required: true,
    },
    officialLanguage: {
        type: String,
        required: true,
    },
    wardNumber: {
        type: Number,
        required: false,
    },
    policeStation: {
        type: String,
        required: true,
    },
    postOffice: {
        type: String,
        required: true,
    },
    parentArea: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("Areas", AreasSchema);
