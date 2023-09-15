"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Member_1 = __importDefault(require("../models/Member"));
const User_1 = __importDefault(require("../models/User"));
const Community_1 = __importDefault(require("../models/Community"));
const validator_1 = __importDefault(require("validator"));
const ResponseType_1 = require("../types/ResponseType");
const addMember = async (req, res) => {
    try {
        const { community, user, role } = req.body;
        if (validator_1.default.isEmpty(community)) {
            res.json({ message: "Community Id is required!" });
            return;
        }
        if (validator_1.default.isEmpty(user)) {
            res.json({ message: "User Id is required!" });
            return;
        }
        if (validator_1.default.isEmpty(role)) {
            res.json({ message: "Role is required!" });
            return;
        }
        const isUser = await User_1.default.findOne({ id: user });
        if (!isUser) {
            res.json({ message: "The user you want to add, does not exist!" });
            return;
        }
        const ifCommExist = await Community_1.default.findOne({ id: community });
        if (!ifCommExist) {
            res.json({ message: "The community does not exist" });
        }
        const ifExisitngUser = await Member_1.default.findOne({ community, user });
        if (ifExisitngUser) {
            res.json({ message: "The user is already a member of the community!" });
            return;
        }
        const owner = await Community_1.default.aggregate([
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
        ]);
        // @ts-ignore
        if (owner[0].owner !== req.user.id) {
            res.json({ message: "NOT_ALLOWED_TO_ADD_MEMBER" });
            return;
        }
        const member = await Member_1.default.create({ community, user, role });
        if (!member) {
            res.json({ message: "Member not created!" });
            return;
        }
        const newMember = {
            id: member.id,
            community: member.community,
            user: member.user,
            role: member.role,
            createdAt: member.createdAt,
        };
        const response = new ResponseType_1.ResponseData(true, { data: newMember });
        res.status(201).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
const deleteMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        // console.log(memberId)
        // @ts-ignore
        const ownerId = req.user.id;
        // console.log(ownerId)
        // @ts-ignore
        // console.log(req.user)
        if (!memberId) {
            res.json({ message: "Invalid Id" });
            return;
        }
        const ifUser = await User_1.default.findOne({ id: memberId });
        if (!ifUser) {
            res.json({ message: "User does not exist" });
            return;
        }
        const myCommunities = await Community_1.default.find({ owner: ownerId }).select("id -_id");
        const myCommunitiesIds = myCommunities.map((community) => community.id);
        const ifMyCommunityMember = await Member_1.default.aggregate([
            {
                $match: {
                    user: memberId,
                    community: {
                        $in: myCommunitiesIds
                    }
                }
            },
        ]);
        if (ifMyCommunityMember.length === 0) {
            res.json({ message: "NOT_ALLOWED_TO_DELETE_MEMBER" });
            return;
        }
        const deletedMember = await Member_1.default.findOneAndDelete({ user: memberId });
        if (!deletedMember) {
            res.json({ message: "Member not deleted!" });
            return;
        }
        res.json({ status: true });
    }
    catch (error) {
    }
};
exports.default = { addMember, deleteMember };
//# sourceMappingURL=memberController.js.map