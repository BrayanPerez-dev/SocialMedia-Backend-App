import { Router } from "express";
import userController from '../controllers/user-controller'
import { registerValidator } from "../validators/register";
import { loginValidator } from "../validators/login";

const router=Router();


router.post("/register",registerValidator,userController.registerUser);
router.post("/login",loginValidator,userController.loginUser);

export default router;