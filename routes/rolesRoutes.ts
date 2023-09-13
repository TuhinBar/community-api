import { Router } from "express";
import roleController from "../controllers/roleController";

const router = Router();

router.post("/role", roleController.createRole);
router.get("/role", roleController.getRoles);

export default router;