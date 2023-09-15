"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decodeToken_1 = __importDefault(require("../utils/decodeToken"));
const User_1 = __importDefault(require("../models/User"));
const checkAuth = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            res.status(401).json({ message: "You are not authorized!" });
            return;
        }
        const decodedToken = (0, decodeToken_1.default)(token);
        if (decodedToken === undefined) {
            res.status(401).json({ message: "You are not authorized!" });
            return;
        }
        // @ts-ignore
        const user = await User_1.default.findOne({ id: decodedToken.id });
        if (!user) {
            res.status(401).json({ message: "You are not authorized!" });
            return;
        }
        // @ts-ignore
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
exports.default = checkAuth;
//# sourceMappingURL=auth.js.map