"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleController_1 = __importDefault(require("../controllers/roleController"));
const router = (0, express_1.Router)();
router.post("/role", roleController_1.default.createRole);
router.get("/role", roleController_1.default.getRoles);
exports.default = router;
//# sourceMappingURL=rolesRoutes.js.map