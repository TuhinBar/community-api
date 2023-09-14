import { Router } from "express";
import communityController from "../controllers/communityController";

const router = Router();

router.route("/community")
    .post(communityController.createCommunity)
    .get(communityController.getAllCommunities);

router.get("/community/:id/members",communityController.getAllMemebers)
router.get("/community/me/owner",communityController.getOwnedCommunities)
router.get("/community/me/member",communityController.getMemberedCommunities)

export default router;