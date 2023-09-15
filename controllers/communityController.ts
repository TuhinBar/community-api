import Community from "../models/Community";
import Role from "../models/Role";
import Member from "../models/Member";
import validator from "validator";
import { Request, Response } from "express";
import { ResponseData } from "../types/ResponseType";
import {CommunityType} from "../types/CommunityType";

const createCommunity = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || validator.isEmpty(name) || name.length < 2 ) {
      res.json({ message: "Name must be greater than 2 letters!" });
      return;
    }



    const role = await Role.findOne({ name: "Community Admin" }).select("id");
    // console.log(role);
    const community = await Community.create({
      name,
      slug: name.toLowerCase(),
      // @ts-ignore
      owner: req.user.id,
    });
    if (!community) {
      res.json({ message: "Community not created!" });
      return;
    }
    const member = await Member.create({
      community: community.id,
      // @ts-ignore
      user: req.user.id,
      role: role?.id,
    });
    if (!member) {
      res.json({ message: "Member not created!" });
      return;
    }

    const newCommunity : CommunityType = {
      id: community.id,
      name: community.name,
      slug: community.slug,
      owner: community.owner,
      createdAt: community.createdAt,
      updatedAt: community.updatedAt,
    };
    const response = new ResponseData(true, { data: newCommunity });
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    if (!page || !limit) {
      res.json({ message: "Page and Limit are required!" });
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
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          slug: 1,
          owner: {
            $arrayElemAt: [
              {
                $map: {
                  input: "$owner",
                  as: "owner",
                  in: {
                    id: "$$owner.id",
                    name: "$$owner.name",
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      },
      {
        $limit: parseInt(limit as string),
      },
    ]);

    // console.log(communities);
    const response = new ResponseData(true, {
      meta: { total, page: Number(page), pages },
      data: communities,
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const getAllMemebers = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const communityId = req.params.id;

    if (!page || !limit || !communityId) {
      res.json({ message: "Page and Limit and community id are required!" });
      return;
    }
    const total = await Member.countDocuments();

    const members = await Member.aggregate([
      {
        $match: {
          community: communityId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "id",
          as: "role",
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          community: 1,
          user: {
            $arrayElemAt: [
              {
                $map: {
                  input: "$user",
                  as: "user",
                  in: {
                    id: "$$user.id",
                    name: "$$user.name",
                  },
                },
              },
              0,
            ],
          },
          role: {
            $arrayElemAt: [
              {
                $map: {
                  input: "$role",
                  as: "role",
                  in: {
                    id: "$$role.id",
                    name: "$$role.name",
                  },
                },
              },
              0,
            ],
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      },
      {
        $limit: parseInt(limit as string),
      },
    ]);
    const pages = Math.ceil(total / parseInt(limit as string));

    const response = new ResponseData(true, {
      meta: { total, page: Number(page), pages },
      data: members,
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const getOwnedCommunities = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    // @ts-ignore
    const userId = req.user.id;

    if (!page || !limit || !userId) {
      res.json({ message: "Page and Limit and user id are required!" });
      return;
    }
    const total = await Community.countDocuments({ owner: userId });

    const communities = await Community.find({ owner: userId })
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string))
      .select("-__v -_id");
    const pages = Math.ceil(total / parseInt(limit as string));
    if (communities.length === 0) {
      res.json({ message: "No community found!" });
      return;
    }
    const response = new ResponseData(true, {
      meta: { total, page: Number(page), pages },
      data: communities,
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const getMemberedCommunities = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    // @ts-ignore
    const userId = req.user.id;

    if (!page || !limit || !userId) {
      res.json({ message: "Page and Limit and user id are required!" });
      return;
    }

    const memberedCommunities = await Member.find({ user: userId }).select(
      "community -_id"
    );

    const notOwnedCommunityIds = [];

    for (const community of memberedCommunities) {
      const commIds = await Community.find({
        owner: { $ne: userId },
        id: community.community,
      }).select("id -_id");
      if(commIds.length !== 0){
          //   @ts-ignore
        notOwnedCommunityIds.push(commIds);
      }
    }
    const total = notOwnedCommunityIds.length

    

    const communities = await Community.aggregate([
        {
            $match: {
                id: {
                    // @ts-ignore
                    $in: notOwnedCommunityIds.map((community) => community[0].id)

        }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "id",
                as: "owner",
            },
        },
        {
            $project: {
                _id: 0,
                id: 1,
                name: 1,
                slug: 1,
                owner: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: "$owner",
                                as: "owner",
                                in: {
                                    id: "$$owner.id",
                                    name: "$$owner.name",
                                },
                            },
                        },
                        0,
                    ],
                },
                createdAt: 1,
                updatedAt: 1,
            },
        },
        {
            $skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        },
        {
            $limit: parseInt(limit as string),
        },
    ]);

    // console.log(communities);

    const pages = Math.ceil(total / parseInt(limit as string));

    const response = new ResponseData(true, {
    meta: { total, page: Number(page), pages },
    data: communities,
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export default {
  createCommunity,
  getAllCommunities,
  getAllMemebers,
  getOwnedCommunities,
  getMemberedCommunities,
};
