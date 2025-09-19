import mongoose, { Schema, model } from "mongoose";
import { dbString } from "./config.js";

await mongoose.connect(dbString);

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const contentType = ['document', 'tweet', 'youtube', 'link'];
const contentSchema = new Schema({
    link:{type:String, required:true},
    type:{
        type:String,
        enum:contentType,
        required:true
    },
    title:{type:String, required:true},
    tags:[{type:String}],
    userId:{type:mongoose.Types.ObjectId, ref:'User', required:true}
})

const linkSchema = new Schema({
    hash:{
        type:String,
        required:true
    },
    userId:{type:mongoose.Types.ObjectId, ref:'User', required:true}
})

export const userModel = model("User", userSchema);
export const linkModel = model("Link", linkSchema);
export const contentModel = model("Content", contentSchema);