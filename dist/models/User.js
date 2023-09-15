"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const snowflake_1 = require("@theinternetfolks/snowflake");
const UserSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        default: snowflake_1.Snowflake.generate,
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.js.map