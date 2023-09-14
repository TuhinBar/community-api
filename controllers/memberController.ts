import Member from '../models/Member';
import User from '../models/User';
import Community from '../models/Community';
import { Request, Response } from 'express';
import validator from 'validator';
import { ResponseData } from '../types/ResponseType';

const addMember = async (req: Request, res: Response) => {
    try {
        const {community,user,role} = req.body;
        if(validator.isEmpty(community)){
            res.json({message: "Community Id is required!"})
            return;
        }
        if(validator.isEmpty(user)){
            res.json({message: "User Id is required!"})
            return;
        }
        if(validator.isEmpty(role)){
            res.json({message: "Role is required!"})
            return;
        }

        const isUser = await User.findOne({id: user});
        if(!isUser){
            res.json({message: "The user you want to add, does not exist!"})
            return;
        }

        const ifCommExist = await Community.findOne({id: community})

        if(!ifCommExist){
            res.json({message: "The community does not exist"})
        }

        const ifExisitngUser = await Member.findOne({community, user});
        if(ifExisitngUser){
            res.json({message: "The user is already a member of the community!"})
            return;
        }
        const owner = await Community.aggregate([
            {
                $match: {
                    id: community
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "id",
                    as: "owner"
                }
            },
            {
                $unwind: "$owner"
            },
            {
                $project: {
                    _id: 0,
                    owner: "$owner.id"
                }
            },
            

        ])
        // @ts-ignore
        if(owner[0].owner !== req.user.id){
            res.json({message: "NOT_ALLOWED_TO_ADD_MEMBER"})
            return;
        }
        const member = await Member.create({community, user, role});

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


const deleteMember = async (req: Request, res: Response)=>{
    try {
        const memberId = req.params.id
        // console.log(memberId)
    // @ts-ignore
    const ownerId = req.user.id
    // console.log(ownerId)
    // @ts-ignore
    // console.log(req.user)
    if(!memberId){
        res.json({message:"Invalid Id"})
        return
    }

    const ifUser = await User.findOne({id:memberId})

    if(!ifUser){
        res.json({message: "User does not exist"})
        return
    }

    const myCommunities = await Community.find({owner:ownerId}).select("id -_id")
    const myCommunitiesIds = myCommunities.map((community:any)=>community.id)

    const ifMyCommunityMember = await Member.aggregate([
        {
            $match: {
                user: memberId,
                community: {
                    $in: myCommunitiesIds
                }
            }
        },
    ])
    if(ifMyCommunityMember.length === 0){
        res.json({message: "NOT_ALLOWED_TO_DELETE_MEMBER"})
        return
    }
    const deletedMember = await Member.findOneAndDelete({user: memberId})
    if(!deletedMember){
        res.json({message: "Member not deleted!"})
        return
    }
    res.json({status: true})
    } catch (error) {
        
    }



}







export default {addMember,deleteMember}
