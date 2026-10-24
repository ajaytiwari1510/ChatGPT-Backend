import express from "express"
import { signup, login, logout, profile, deleteAccount } from "../controllers/userController.js"
import authUserMiddleware from "../middlewares/authUserMiddleware.js"
import unauthenticatedRateLimiter from "../middlewares/unauthenticatedRateLimiter.js"
import authenticatedRateLimiter from "../middlewares/authenticatedRateLimiter.js"
import loadUserMiddleware from "../middlewares/loadUserMiddleware.js"

const userRouter = express.Router();

//Login, Signup, Logout, Profile: User Related
userRouter.post("/signup",unauthenticatedRateLimiter, signup);
userRouter.post("/login", unauthenticatedRateLimiter, login);
userRouter.post("/logout",authUserMiddleware, authenticatedRateLimiter, logout);
userRouter.get("/profile", authUserMiddleware, authenticatedRateLimiter, loadUserMiddleware, profile);
userRouter.delete("/delete", authUserMiddleware, authenticatedRateLimiter, loadUserMiddleware, deleteAccount);



export default userRouter;
