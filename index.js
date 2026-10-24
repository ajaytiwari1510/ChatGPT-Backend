import dotenv from "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import { connectRedis } from "./config/redis.js";
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chatRouter.js";


const app = express();

app.use(express.json());
app.use(cookieParser());


//Login, Signup, Logout, Profile: User Related
app.use("/user", userRouter);
app.use("/msg", messageRouter);
app.use("/chat", chatRouter);


const startServer = async ()=>{
  try{
      await connectDB();
      await connectRedis();

      app.listen(process.env.PORT, ()=> {
        console.log(`Server is running at PORT: ${process.env.PORT}`);
      }
    );
  }
  catch(err){
    console.log(err);
  }

};

startServer();
