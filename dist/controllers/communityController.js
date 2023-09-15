"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Community_1 = __importDefault(require("../models/Community"));
const Role_1 = __importDefault(require("../models/Role"));
const Member_1 = __importDefault(require("../models/Member"));
const validator_1 = __importDefault(require("validator"));
const ResponseType_1 = require("../types/ResponseType");
const createCommunity = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || validator_1.default.isEmpty(name) || name.length < 2) {
            res.json({ message: "Name must be greater than 2 letters!" });
            return;
        }
        const role = await Role_1.default.findOne({ name: "Community Admin" }).select("id");
        // console.log(role);
        const community = await Community_1.default.create({
            name,
            slug: name.toLowerCase(),
            // @ts-ignore
            owner: req.user.id,
        });
        if (!community) {
            res.json({ message: "Community not created!" });
            return;
        }
        const member = await Member_1.default.create({
            community: community.id,
            // @ts-ignore
            user: req.user.id,
            role: role?.id,
        });
        if (!member) {
            res.json({ message: "Member not created!" });
            return;
        }
        const newCommunity = {
            id: community.id,
            name: community.name,
            slug: community.slug,
            owner: community.owner,
            createdAt: community.createdAt,
            updatedAt: community.updatedAt,
        };
        const response = new ResponseType_1.ResponseData(true, { data: newCommunity });
        res.status(201).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
const getAllCommunities = async (req, res) => {
    try {
        const { page, limit } = req.query;
        if (!page || !limit) {
            res.json({ message: "Page and Limit are required!" });
            return;
        }
        const total = await Community_1.default.countDocuments();
        const pages = Math.ceil(total / parseInt(limit));
        const communities = await Community_1.default.aggregate([
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
                $skip: (parseInt(page) - 1) * parseInt(limit),
            },
            {
                $limit: parseInt(limit),
            },
        ]);
        // console.log(communities);
        const response = new ResponseType_1.ResponseData(true, {
            meta: { total, page: Number(page), pages },
            data: communities,
        });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
const getAllMemebers = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const communityId = req.params.id;
        if (!page || !limit || !communityId) {
            res.json({ message: "Page and Limit and community id are required!" });
            return;
        }
        const total = await Member_1.default.countDocuments();
        const members = await Member_1.default.aggregate([
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
                $skip: (parseInt(page) - 1) * parseInt(limit),
            },
            {
                $limit: parseInt(limit),
            },
        ]);
        const pages = Math.ceil(total / parseInt(limit));
        const response = new ResponseType_1.ResponseData(true, {
            meta: { total, page: Number(page), pages },
            data: members,
        });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
const getOwnedCommunities = async (req, res) => {
    try {
        const { page, limit } = req.query;
        // @ts-ignore
        const userId = req.user.id;
        if (!page || !limit || !userId) {
            res.json({ message: "Page and Limit and user id are required!" });
            return;
        }
        const total = await Community_1.default.countDocuments({ owner: userId });
        const communities = await Community_1.default.find({ owner: userId })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .select("-__v -_id");
        const pages = Math.ceil(total / parseInt(limit));
        if (communities.length === 0) {
            res.json({ message: "No community found!" });
            return;
        }
        const response = new ResponseType_1.ResponseData(true, {
            meta: { total, page: Number(page), pages },
            data: communities,
        });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
const getMemberedCommunities = async (req, res) => {
    try {
        const { page, limit } = req.query;
        // @ts-ignore
        const userId = req.user.id;
        if (!page || !limit || !userId) {
            res.json({ message: "Page and Limit and user id are required!" });
            return;
        }
        const memberedCommunities = await Member_1.default.find({ user: userId }).select("community -_id");
        const notOwnedCommunityIds = [];
        for (const community of memberedCommunities) {
            const commIds = await Community_1.default.find({
                owner: { $ne: userId },
                id: community.community,
            }).select("id -_id");
            if (commIds.length !== 0) {
                //   @ts-ignore
                notOwnedCommunityIds.push(commIds);
            }
        }
        const total = notOwnedCommunityIds.length;
        const communities = await Community_1.default.aggregate([
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
                $skip: (parseInt(page) - 1) * parseInt(limit),
            },
            {
                $limit: parseInt(limit),
            },
        ]);
        // console.log(communities);
        const pages = Math.ceil(total / parseInt(limit));
        const response = new ResponseType_1.ResponseData(true, {
            meta: { total, page: Number(page), pages },
            data: communities,
        });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
exports.default = {
    createCommunity,
    getAllCommunities,
    getAllMemebers,
    getOwnedCommunities,
    getMemberedCommunities,
};
//# sourceMappingURL=communityController.js.map