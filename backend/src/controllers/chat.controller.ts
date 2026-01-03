import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import Chat from "../models/chat.model";
import client from "../redis/client";
import { io } from "../socket/socket";
import { MessageProps } from "../types";

export const sendChatMessage = async (req: Request, res: Response) => {
    try {
        const conversationId = req.params.id;
        const senderId = req.user?._id;
        const { cipherText, nonce } = req.body as MessageProps;

        if (!senderId) {
            res.status(400).json({ error: "Cannot fetch Sender ID" });
            return;
        }

        if (!cipherText || !nonce) {
            res.status(400).json({ error: "Message cannot be empty" });
            return;
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            res.status(400).json({ error: "Conversation not found" });
            return;
        }

        const isParticipant = conversation.participants.some(
            (id) => id.toString() === senderId.toString()
        );
        if (!isParticipant) {
            res.status(403).json({ error: "Not a participant of this chat" });
            return;
        }

        const receiverId = conversation.participants.find(
            (id) => id.toString() !== senderId.toString()
        );
        if (!receiverId) {
            res.status(400).json({ error: "Receiver not found" });
            return;
        }

        const newChat = new Chat({
            sender: senderId,
            receiver: receiverId,
            cipherText,
            nonce
        });

        if (newChat) {
            conversation.chats.push(newChat._id);
            await Promise.all([newChat.save(), conversation.save()]);
        }

        const receiverSocketId = await client.hget("ONLINE_USERS", receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newChatMessage", {
                conversationId,
                chat: newChat
            });
        }

        res.status(201).json(newChat);
    } catch (error) {
        console.log("Error in sendChatMessage controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}