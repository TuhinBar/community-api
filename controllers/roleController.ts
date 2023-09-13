import Role from '../models/Role';
import { Request, Response } from 'express';
import validator from 'validator';
import { ResponseData } from '../types/ResponseType';



const createRole = async (req: Request, res: Response) => {
    try {
        const {name} = req.body;
        if(validator.isEmpty(name) || name.length < 2){
            res.json({message: "Name must be greater than 2 letters!"})
            return;
        }
        const role = await Role.create({ name });
        if(!role){
            res.json({message: "Role not created!"})
            return;
        }
        const newRole = {
            id: role.id,
            name: role.name,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt
        }
        const response = new ResponseData(true,{data: newRole})
        res.status(201).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}


const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.find();
        if(!roles){
            res.json({message: "Roles not found!"})
            return;
        }
        const response = new ResponseData(true,{data: roles})
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

export default {createRole, getRoles}