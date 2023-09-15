"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const ResponseType_1 = require("../types/ResponseType");
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const decodeToken_1 = __importDefault(require("../utils/decodeToken"));
const signUp = async (req, res) => {
    try {
        const data = req.body;
        if (!data.name || !data.email || !data.password) {
            res.json({ message: "All fields are required!" });
            return;
        }
        if (validator_1.default.isEmpty(data.name) || data.name.length < 2) {
            res.json({ message: "Name must be greater than 2 letters!" });
            return;
        }
        if (!validator_1.default.isEmail(data.email) || !data.email) {
            res.json({ message: "Please enter a valid email!" });
            return;
        }
        if (!validator_1.default.isStrongPassword(data.password, { minLength: 6 })) {
            res.json({ message: "Password must be greater than 6 characters!" });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
        const user = await User_1.default.create({ name: data.name, email: data.email, password: hashedPassword });
        if (!user) {
            res.json({ message: "User not created!" });
            return;
        }
        const token = (0, generateToken_1.default)(user.id);
        const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
        const response = new ResponseType_1.ResponseData(true, { data: newUser }, { access_token: token });
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        });
        res.status(201).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
const signIn = async (req, res) => {
    try {
        const data = req.body;
        if (!data.email || !data.password) {
            res.json({ message: "All fields are required!" });
            return;
        }
        if (!validator_1.default.isEmail(data.email) || !data.email) {
            res.json({ message: "Please enter a valid email!" });
            return;
        }
        if (validator_1.default.isEmpty(data.password) || data.password.length < 6) {
            res.json({ message: "Password cannot be empty!" });
            return;
        }
        const user = await User_1.default.findOne({ email: data.email });
        if (!user) {
            res.json({ message: "User not found!" });
            return;
        }
        // @ts-ignore
        const isMatch = await bcrypt_1.default.compare(data.password, user?.password);
        if (!isMatch) {
            res.json({ message: "Invalid Credentials!" });
            return;
        }
        const token = (0, generateToken_1.default)(user.id);
        const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
        const response = new ResponseType_1.ResponseData(true, { data: newUser }, { access_token: token });
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
const getSingleUser = async (req, res) => {
    try {
        const { authToken } = req.cookies;
        const tokenData = (0, decodeToken_1.default)(authToken);
        // console.log(tokenData)
        if (tokenData === undefined) {
            res.json({ message: "You are not authorized" });
            return;
        }
        // @ts-ignore
        const user = await User_1.default.findOne({ id: tokenData.id });
        if (!user) {
            res.json({ message: "User not found!" });
            return;
        }
        const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
        const response = new ResponseType_1.ResponseData(true, { data: newUser });
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.default = { signUp, signIn, getSingleUser };
//# sourceMappingURL=usercontroller.js.map