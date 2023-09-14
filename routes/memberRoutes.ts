import { Router } from "express";
import memberController from "../controllers/memberController";

const router = Router();

router.post("/member", memberController.addMember);
router.delete("/member/:id", memberController.deleteMember);


export default router;
