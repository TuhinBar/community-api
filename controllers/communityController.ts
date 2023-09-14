import Community from "../models/Community";
import { Request, Response } from "express";
import { ResponseData } from "../types/ResponseType";

const createCommunity = async (req: Request, res: Response) => {
    try {
        const {name} = req.body;
        // @ts-ignore
        const community = await Community.create({name,slug: name.toLowerCase(), owner: req.user.id});

        if(!community){
            res.json({message: "Community not created!"})
            return;
        }

        const newCommunity = {
            id: community.id,
            name: community.name,
            slug: community.slug,
            owner: community.owner,
            createdAt: community.createdAt,
            updatedAt: community.updatedAt,
        }
        const response = new ResponseData(true,{data: newCommunity});
        res.status(201).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

const getAllCommunities = async (req: Request, res: Response) => {
    try {
        const {page,limit} = req.query;
        if(!page || !limit){
            res.json({message: "Page and Limit are required!"})
            return;
        }
        const total = await Community.countDocuments();
        const pages = Math.ceil(total / parseInt(limit as string));
        const communities = await Community.aggregate([
            {
                // @ts-ignore
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "id",
                    as: "owner",
            },
            
        },
        {
            $project:{
                _id: 0,
                id: 1,
                name: 1,
                slug: 1,
                owner: {
                    $arrayElemAt: [{
                        $map: {
                            input: "$owner",
                            as: "owner",
                            in: {
                                id: "$$owner.id",
                                name: "$$owner.name",
                            }
                        }
                    },0] 
            },

        }
    },
    {
        $skip: (parseInt(page as string) - 1) * parseInt(limit as string)
    },
    {
        $limit: parseInt(limit as string)
    }
])


        // console.log(communities);
        const response = new ResponseData(true,{meta:{total,page: Number(page),pages},data: communities});
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}


export default {createCommunity,getAllCommunities}