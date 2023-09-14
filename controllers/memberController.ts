import Member from '../models/Member';
import { Request, Response } from 'express';
import validator from 'validator';
import { ResponseData } from '../types/ResponseType';

const addMember = async (req: Request, res: Response) => {
    try {
        const {communityId,userId,role} = req.body;
        if(validator.isEmpty(communityId)){
            res.json({message: "Community Id is required!"})
            return;
        }
        if(validator.isEmpty(userId)){
            res.json({message: "User Id is required!"})
            return;
        }
        if(validator.isEmpty(role)){
            res.json({message: "Role is required!"})
            return;
        }
        const member = await Member.create({community: communityId, user: userId, role});

        if(!member){
            res.json({message: "Member not created!"})
            return;
        }
        const newMember = {
            id: member.id,
            community: member.community,
            user: member.user,
            role: member.role,
            createdAt: member.createdAt,
        }
        const response = new ResponseData(true,{data: newMember})
        res.status(201).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}





export default {addMember}
