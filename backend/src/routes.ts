import { Router } from "express";
import parseObject from "./types.js";
import bcrypt from "bcrypt";
import { userModel, contentModel, linkModel } from "./db.js";
import jwt from "jsonwebtoken";
import { secret } from "./config.js";
import authMiddleware from "./authMiddleware.js";
import random from "./util.js";


const routes = Router();

routes.post("/v1/signup", async(req, res)=>{
    try{
        const userCred = req.body;
        const parse = parseObject.safeParse(userCred);

        if(!parse.success){
            return res.status(400).json({
                message:"Error in inputs"
            })
        }

        const user = await userModel.findOne({username: parse.data.username});
        if(user){
            return res.status(409).json({
                message:"User already exist"
            })
        }

        const hashPassword = await bcrypt.hash(parse.data.password, 10);

        await userModel.create({
            username: parse.data.username,
            password: hashPassword
        })

        res.status(200).json({
            message:"Signed up"
        })
    }

    catch(err){
        res.status(500).json({
            message:"Server error"
        })
    }

})

routes.post("/v1/signin", async(req, res)=>{
    try {
        const {username, password} = req.body;
        const user = await userModel.findOne({username})

        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        const verify = user.password ? bcrypt.compare(password, user.password) : false;
        if(!verify){
            return res.status(401).json({
                message:"Incorrect Password"
            })
        }

        const token = jwt.sign({
            id:user._id
        },secret)

        res.status(200).json({
            token
        })
    } 
    catch (err) {
        res.status(500).json({
            message:"Internal server error"
        })    
    }
})

routes.post("/v1/content",authMiddleware, async(req, res)=>{
        const {link, type, title, tags} = req.body;
        await contentModel.create({
            link,
            type,
            title,
            tags:tags,
            userId:req.userId
        })
        res.json({
            message:"Content added"
        })    

})

routes.get("/v1/content",authMiddleware, async(req, res)=>{
        const userId = req.userId;
        const content = await contentModel.find({
            userId
        }).populate("userId", "username")
        if(!content){
            return res.json({
                message:"No content"
            })
        }
        res.json({
            content
        })    

})

routes.delete("/v1/:id",authMiddleware, async(req, res)=>{
        const contentId = req.params.id;
        const result = await contentModel.deleteMany({
            _id:contentId,
            userId:req.userId
        })
        if(result.deletedCount === 0){
            return res.status(404).json({
                message:"Content not found or unauthorised"
            })
        }
        res.json({
            message:"Content deleted"
        })    

})

routes.post("/v1/brain/share",authMiddleware, async(req, res)=>{
        const share = req.body.share;
        if(share == true){
            const link = await linkModel.findOne({
                userId:req.userId
            })
            if(link){
                return res.json({
                    message:"Share link is already enabled"
                })
            }
            const hash = random(10);
            console.log(hash);
            await linkModel.create({
                hash,
                userId:req.userId
            })
            res.json({
                message:"Share link enabled"
            })
        }

        else if(share == false){
            await linkModel.deleteOne({
                userId:req.userId
            })
            res.json({
                message:"Share link removed"
            })
        }
        else{
            res.json({
                message:"Invalid input"
            })
        }
})

routes.get("/v1/brain/:shareLink", async(req, res)=>{
        const hash = req.params.shareLink;
        const link = await linkModel.findOne({
            hash:String(hash)
        })
        if(!link){
            return res.json({
                message:"Access denied"
            })
        }

        const [user, content] = await Promise.all([
            userModel.findOne({_id:link.userId}),
            contentModel.find({userId:link.userId})
        ])
        if(!user){
            return res.json({
                message:"User doesn't exist"
            })
        }
        res.json({
            username:user.username,
            content:content
        })    

})

export default routes;