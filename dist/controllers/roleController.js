"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = __importDefault(require("../models/Role"));
const validator_1 = __importDefault(require("validator"));
const ResponseType_1 = require("../types/ResponseType");
const createRole = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.json({ message: "Name is required!" });
            return;
        }
        if (validator_1.default.isEmpty(name) || name.length < 2) {
            res.json({ message: "Name must be greater than 2 letters!" });
            return;
        }
        const role = await Role_1.default.create({ name });
        if (!role) {
            res.json({ message: "Role not created!" });
            return;
        }
        const newRole = {
            id: role.id,
            name: role.name,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt
        };
        const response = new ResponseType_1.ResponseData(true, { data: newRole });
        res.status(201).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
const getRoles = async (req, res) => {
    try {
        const { page, limit } = req.query;
        if (!page || !limit) {
            res.json({ message: "Page and Limit are required!" });
            return;
        }
        const total = await Role_1.default.countDocuments();
        const roles = await Role_1.default.find().limit(Number(limit)).skip((Number(page) - 1) * Number(limit)).select("-__v -_id");
        if (!roles) {
            res.json({ message: "Roles not found!" });
            return;
        }
        const pages = Math.ceil(total / Number(limit));
        const response = new ResponseType_1.ResponseData(true, { meta: { total, page: Number(page), pages: pages }, data: roles });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
exports.default = { createRole, getRoles };
//# sourceMappingURL=roleController.js.map