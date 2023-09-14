import mongoose from "mongoose";
import {Snowflake} from "@theinternetfolks/snowflake";

const communitySchema = new mongoose.Schema({
    id:{
        type: String,
        default: Snowflake.generate,
        unique: true
    },
    name: {
        type: String,
    },
    slug:{
        type: String,
        unique: true
    },
    owner:{
        type: String,
        ref: "User" ,
        localField: "owner",
        foreignField: "id",
    },
    
},{timestamps: true});

export default mongoose.model("Community", communitySchema);