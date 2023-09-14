import { Router } from "express";
import memberController from "../controllers/memberController";

const router = Router();

router.post("/member", memberController.addMember);


export default router;
