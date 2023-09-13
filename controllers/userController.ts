import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import validator from "validator"

const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if(validator.isEmpty(name) || name.length < 2){
            res.json({message: "Name must be greater than 2 letters!"})
            return;
        }
        if(!validator.isEmail(email) || !email){
            res.json({message: "Please enter a valid email!"})
            return;
        }
        if(!validator.isStrongPassword(password,{minLength: 6})){
            res.json({message: "Password must be greater than 6 characters!"})
            return;
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
}

const signIn = async (req: Request, res: Response) => {


}

const getSingleUser = async (req: Request, res: Response) => {

}


export default { signUp, signIn,getSingleUser };