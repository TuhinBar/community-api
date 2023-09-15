"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usercontroller_1 = __importDefault(require("../controllers/usercontroller"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/auth/signup", usercontroller_1.default.signUp);
router.post("/auth/signin", usercontroller_1.default.signIn);
router.get("/auth/me", auth_1.default, usercontroller_1.default.getSingleUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map