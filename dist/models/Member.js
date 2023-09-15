"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const snowflake_1 = require("@theinternetfolks/snowflake");
const MemberSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        default: snowflake_1.Snowflake.generate,
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("Member", MemberSchema);
//# sourceMappingURL=Member.js.map