import express from "express"
import authUserMiddleware from "../middlewares/authUserMiddleware.js"
import {getRecentChat, getSingleChat, createChat, deleteChat} from "../controllers/chatController.js"
import authenticatedRateLimiter from "../middlewares/authenticatedRateLimiter.js"
import loadUserMiddleware from "../middlewares/loadUserMiddleware.js"



const chatRouter = express.Router();

chatRouter.use(authUserMiddleware);
chatRouter.use(authenticatedRateLimiter);
chatRouter.use(loadUserMiddleware);

// Get Recent chats : Top 20 chats, getRecentChat, getSingleChat,  createChat, deleteChat

chatRouter.post("/createChat", createChat);
chatRouter.get("/getRecentChat", getRecentChat);
chatRouter.get("/:chatId", getSingleChat);
chatRouter.delete("/:chatId", deleteChat);


export default chatRouter;