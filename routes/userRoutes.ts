import { Router } from "express";
import usercontroller from "../controllers/usercontroller";

const router = Router();

router.post("/auth/signup", usercontroller.signUp);
router.post("/auth/signin", usercontroller.signIn);
router.get("/auth/me", usercontroller.getSingleUser);


export default router;