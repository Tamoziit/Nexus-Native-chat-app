import { Request, Response } from "express";
import User from "../models/user.model";

export const exploreAccounts = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            res.status(400).json({ error: "Cannot find user" });
            return;
        }

        const accounts = await User.find({
            _id: { $nin: [...user.friends, ...user.requests, user._id] }
        }).select("_id fullName username mobileNo profilePic gender")
            .lean();

        if (accounts) {
            res.status(200).json(accounts);
        } else {
            res.status(400).json({ error: "Error in fetching User Accounts" })
        }
    } catch (error) {
        console.log("Error in exploreAccounts controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const sendInvite = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const sender = await User.findById(req.user?._id);
        const receiver = await User.findById(id);

        if (!sender || !receiver) {
            res.status(400).json({ error: "Cannot find user" });
            return;
        }

        if (sender.friends.includes(id) || sender.requests.includes(id)) {
            res.status(400).json({ error: "User already in your friend list" });
            return;
        }

        receiver.invites.push(req.user!._id);
        sender.requests.push(id);
        await Promise.all([receiver.save(), sender.save()]);
        res.status(200).json({ message: "Request send successfully" });
    } catch (error) {
        console.log("Error in sendInvite controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}