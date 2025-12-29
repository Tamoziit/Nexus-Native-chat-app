import { Request, Response } from "express";
import Conversation from "../models/conversation.model";

export const getUserConversations = async (req: Request, res: Response) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user?._id] }
        }).populate({
            path: "participants",
            select: "_id username profilePic",
        }).select("-chats")
            .lean();

        if (!conversations) {
            res.status(400).json({ error: "Cannot find your conversations" });
            return;
        }

        res.status(200).json(conversations);
    } catch (error) {
        console.log("Error in exploreAccounts controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}