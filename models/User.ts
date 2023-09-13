import mongoose from "mongoose";
import {Snowflake} from "@theinternetfolks/snowflake";

const UserSchema = new mongoose.Schema({
    id:{
        type: String,
        default: Snowflake.generate,
        unique: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    
},{timestamps: true});

export default mongoose.model("User", UserSchema);