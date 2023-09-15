import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import validator from "validator"
import { UserType } from "../types/UserType";
import { ResponseData } from "../types/ResponseType";
import generateToken from "../utils/generateToken";
import decodeToken from "../utils/decodeToken";

const signUp = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        if(!data.name || !data.email || !data.password){
            res.json({message: "All fields are required!"})
            return;
        }

        if(validator.isEmpty(data.name) || data.name.length < 2){
            res.json({message: "Name must be greater than 2 letters!"})
            return;
        }
        if(!validator.isEmail(data.email) || !data.email){
            res.json({message: "Please enter a valid email!"})
            return;
        }
        if(!validator.isStrongPassword(data.password,{minLength: 6})){
            res.json({message: "Password must be greater than 6 characters!"})
            return;
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data.password,salt)
        const user = await User.create({ name: data.name, email:data.email, password: hashedPassword });

        if(!user){
            res.json({message: "User not created!"})
            return;
        }
        const token = generateToken(user.id);
        const newUser: UserType = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        }
        const response = new ResponseData(true,{data: newUser},{access_token: token})
        res.cookie("authToken",token,{
            httpOnly: true,
            secure: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        })

        res.status(201).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

const signIn = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        if(!data.email || !data.password){
            res.json({message: "All fields are required!"})
            return;
        }

        if(!validator.isEmail(data.email) || !data.email){
            res.json({message: "Please enter a valid email!"})
            return;
        }
        if(validator.isEmpty(data.password) || data.password.length < 6){
            res.json({message: "Password cannot be empty!"})
            return;
        }
        
        const user = await User.findOne({ email: data.email });
        if(!user){
            res.json({message: "User not found!"})
            return;
        }
        // @ts-ignore
        const isMatch = await bcrypt.compare(data.password, user?.password);
        if(!isMatch){
            res.json({message: "Invalid Credentials!"})
            return;
        }

        const token = generateToken(user.id);
        const newUser: UserType = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        }
        const response = new ResponseData(true,{data: newUser},{access_token: token})
        res.cookie("authToken",token,{
            httpOnly: true,
            secure: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        })
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }

}

const getSingleUser = async (req: Request, res: Response) => {
   try {
    const {authToken} = req.cookies
    const tokenData = decodeToken(authToken)
    // console.log(tokenData)
    if(tokenData === undefined){
        res.json({message: "You are not authorized"})
        return;
    }
    // @ts-ignore
    const user = await User.findOne({id: tokenData.id})

    if(!user){
        res.json({message: "User not found!"})
        return;
    }
    const newUser: UserType = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    }

    const response = new ResponseData(true,{data: newUser})

    res.status(200).json(response)
    
   } catch (error) {
    res.status(500).json(error)
    
   }

}


export default { signUp, signIn,getSingleUser };