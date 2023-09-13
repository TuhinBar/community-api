import mongoose from "mongoose";
import {Snowflake} from "@theinternetfolks/snowflake";

const MemberSchema = new mongoose.Schema({
    id:{
        type: String,
        default: Snowflake.generate,
        unique: true
    },
    community: {
        type: String,
        ref: "Community"
    },
    user: {
        type: String,
        ref: "User"
    },
    role: {
        type: String,
        ref: "Role"
    },
},{timestamps: true});

export default mongoose.model("Member", MemberSchema);