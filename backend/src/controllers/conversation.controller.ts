import { Request, Response } from "express";
import Conversation from "../models/conversation.model";

export const getUserConversations = async (req: Request, res: Response) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user?._id] }
        })
            .populate({
                path: "participants",
                select: "_id username profilePic"
            })
            .populate({
                path: "chats",
                select: "message createdAt",
                options: { sort: { createdAt: -1 }, limit: 1 }
            })
            .lean();

        if (!conversations) {
            res.status(400).json({ error: "Cannot find conversation" });
            return;
        }

        const result = conversations.map((conv) => ({
            _id: conv._id,
            participants: conv.participants,
            latestMessage: conv.chats.length
                ? conv.chats[0]
                : { message: "Start a new chat", createdAt: new Date() }
        }));

        res.status(200).json(result);
    } catch (error) {
        console.log("Error in getUserConversations controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getUserChatsById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const chats = await Conversation.findById(id)
            .populate({
                path: "participants",
                select: "_id username fullName profilePic publicKey"
            })
            .populate({
                path: "chats"
            })
            .lean();

        if (!chats) {
            res.status(400).json({ error: "Cannot fetch Chats" });
            return;
        }

        res.status(200).json(chats);
    } catch (error) {
        console.log("Error in getUserChats controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}