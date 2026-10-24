import User from "../model/userSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt" 
import {signupSchema, loginSchema} from "../validators/userValidators.js"
import Chat from "../model/chatSchema.js"
import Message from "../model/messageSchema.js"
import { redisClient } from "../config/redis.js"

// Function for Generating Token
const createToken = (id, email)=>{

    if(!process.env.JWT_SECRET){
        throw new Error("JWT Secret key is missing");
    }

    const token = jwt.sign({id,email}, process.env.JWT_SECRET, {expiresIn:"1h"});
    return token;
}


const cookiesOption = {
    httpOnly: true,
    secure: false,
    maxAge: 60*60*1000
}


//signup
export const signup = async (req, res)=>{
    try{

        // Validate all the user data
        const result = signupSchema.safeParse(req.body);

        // Checking any error from zod
        if(!result.success){
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }

        const {name, age, email, password} = result.data;

        // Email already exits or not 
        const user = await User.findOne({email});

        if(user){
            return res.status(409).json({
                message: "Email ID is already exist"
            })
        }

        // If email is not present then create the profile
        const hashPassword = await bcrypt.hash(password, 10);

        const userCreated = await User.create({
            name,
            age,
            email,
            password: hashPassword
        });

        // Create Token
        const token = createToken(userCreated._id, email);

        res.cookie("token", token, cookiesOption);

        res.status(201).json({
            message: "User Created Successfully",
            name,
            age,
            email
        });

    }
    catch(err){
        // Printing error for me 
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

//login
export const login = async (req, res)=>{
    
    try{

        // Validate your details
        const result = loginSchema.safeParse(req.body);

        // Checking any error from zod
        if(!result.success){
            return res.status(400).json({
                message: result.error.issues[0].message
            })
        }

        const {email, password} = result.data;

        // Verify the user Password 
        const existingUser = await User.findOne({email});

        if(!existingUser){
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        // Match the Password
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if(!isMatch){
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = createToken(existingUser._id, email);
        res.cookie("token", token, cookiesOption);
        res.status(200).json({
            message: "Login Successfully",
            name: existingUser.name,
            email: existingUser.email,
            usage: existingUser.usage
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

//logout
export const logout = async (req,res)=>{
    // logut
    try{

        if(req.token){
            const token = req.token;
            const payload = req.tokenPayload;

            const currentTime = Math.floor(Date.now() / 1000);
            const remainingTime = payload.exp - currentTime;

            if (remainingTime > 0) {
                await redisClient.set(
                    `blocklist:${token}`,
                    "blocked",
                    {
                        EX: remainingTime
                    }
                );
            }
        }

        res.clearCookie("token",{
            httpOnly: true,
            secure: false,
        })

        res.status(200).json({
            message: "User Logged Out Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

//profile I want that only me see my profile
// Authenticated User : Only able to see their own profile
// export const profile = async (req, res)=>{
//     try{
//         const {email} = req.body;

//         if(!email){
//             res.status(400).json({
//                 message: "Email is Missing"
//             });
//         }

//         const existingUser = await User.findOne({email});

//         if(!existingUser){
//             return res.status(401).json({message: "Invalid Credentials"});
//         }

//         res.status(200).json({
//             name: existingUser.name,
//             age: existingUser.age,
//             email: existingUser.email,
//             usage: existingUser.usage
//         });
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({
//             message: "Internal Server Error"
//         });
//     }
// }

export const profile = async(req, res)=>{
    try{
        res.status(200).json({
            name: req.user.name,
            age: req.user.age,
            email: req.user.email,
            usage: req.user.usage
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


export const deleteAccount = async (req, res)=>{
    try{
        // find all the chatId which belongs to user

        // Delete all the messages which belongs to that chatId

        // Delete all the chatId which belongs to that UserId

        // Delete user account/profile
        const userId = req.user._id;

        // const chats = await Chat.find({ userId }).select("_id");

        // const chatIds = chats.map((chat) => chat._id);

        await Message.deleteMany({
        // chatId: { $in: chats }
        userId
        });

        await Chat.deleteMany({
        userId
        });

        await User.deleteOne({
        _id: userId
        });

        res.clearCookie("token", {
        httpOnly: true,
        // process.env.NODE_ENV === "production",
        secure: false,
        // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        res.status(200).json({
        message: "Account deleted successfully"
        });
    }
    catch (err) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};