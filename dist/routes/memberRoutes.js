"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const memberController_1 = __importDefault(require("../controllers/memberController"));
const router = (0, express_1.Router)();
router.post("/member", memberController_1.default.addMember);
router.delete("/member/:id", memberController_1.default.deleteMember);
exports.default = router;
//# sourceMappingURL=memberRoutes.js.map