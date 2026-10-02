import mongoose, { mongo } from "mongoose";
const userSchema = new mongoose.Schema({
    fullname: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    phoneNumber: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    role: {
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile: {
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto:{
            type:String,
            default:""
        },
        googleEmail:{type:String},
        githubEmail:{type:String}
    },
}, {timestamps:true});

userSchema.index({ "profile.googleEmail": 1 }, { sparse: true });
userSchema.index({ "profile.githubEmail": 1 }, { sparse: true });

export const User = mongoose.model('User', userSchema);