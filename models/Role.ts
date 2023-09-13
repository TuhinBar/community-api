import mongoose from "mongoose";
import {Snowflake} from "@theinternetfolks/snowflake";

const RoleSchema = new mongoose.Schema({
    id:{
        type: String,
        default: Snowflake.generate,
        unique: true
    },
    name: {
        type: String,
        unique: true
    },
},{timestamps: true});

export default mongoose.model("Role", RoleSchema);
