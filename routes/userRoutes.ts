import { Router } from "express";
import usercontroller from "../controllers/usercontroller";
import checkAuth from "../middlewares/auth";

const router = Router();

router.post("/auth/signup", usercontroller.signUp);
router.post("/auth/signin", usercontroller.signIn);
router.get("/auth/me", checkAuth,usercontroller.getSingleUser);


export default router;