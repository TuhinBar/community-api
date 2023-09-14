import { Router } from "express";
import communityController from "../controllers/communityController";

const router = Router();

router.route("/community")
    .post(communityController.createCommunity)
    .get(communityController.getAllCommunities);

export default router;