"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const communityController_1 = __importDefault(require("../controllers/communityController"));
const router = (0, express_1.Router)();
router.route("/community")
    .post(communityController_1.default.createCommunity)
    .get(communityController_1.default.getAllCommunities);
router.get("/community/:id/members", communityController_1.default.getAllMemebers);
router.get("/community/me/owner", communityController_1.default.getOwnedCommunities);
router.get("/community/me/member", communityController_1.default.getMemberedCommunities);
exports.default = router;
//# sourceMappingURL=communityRoutes.js.map