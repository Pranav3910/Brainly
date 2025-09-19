import { Request, Response, NextFunction } from "express";
import { secret } from "./config.js";
import jwt, {JwtPayload} from "jsonwebtoken"

const authMiddleware = (req:Request, res:Response, next:NextFunction)=>{
    try{
        const token = req.headers["authorization"];
        if(!token){
            return res.status(400).json({
                message:"Signin Required"
            })
        }
        const verify = jwt.verify(token, secret);
        if(!verify){
            return res.status(400).json({
                message:"Signin Required"
            })   
        }
        req.userId = (verify as JwtPayload).id;
        return next();
    }
    catch(err){
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export default authMiddleware;