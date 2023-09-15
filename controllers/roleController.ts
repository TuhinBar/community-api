import Role from '../models/Role';
import { Request, Response } from 'express';
import validator from 'validator';
import { ResponseData } from '../types/ResponseType';
import {RoleType} from '../types/RoleType';



const createRole = async (req: Request, res: Response) => {
    try {
        const {name} = req.body;
        if(!name){
            res.json({message: "Name is required!"})
            return;
        }
        if(validator.isEmpty(name) || name.length < 2){
            res.json({message: "Name must be greater than 2 letters!"})
            return;
        }
        const role = await Role.create({ name });
        if(!role){
            res.json({message: "Role not created!"})
            return;
        }
        const newRole:RoleType = {
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
        const {page,limit} = req.query;
        if (!page || !limit ) {
            res.json({ message: "Page and Limit are required!" });
            return;
          }
        const total = await Role.countDocuments();
        const roles = await Role.find().limit(Number(limit)).skip((Number(page) - 1) * Number(limit)).select("-__v -_id");
        if(!roles){
            res.json({message: "Roles not found!"})
            return;
        }

        const pages = Math.ceil(total / Number(limit));
        const response = new ResponseData(true,{meta:{total,page: Number(page),pages:pages},data: roles})
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

export default {createRole, getRoles}