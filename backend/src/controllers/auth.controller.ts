import { Request, Response } from "express";
import { UserLoginBody, UserSignupBody } from "../types";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import client from "../redis/client";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie";

export const signup = async (req: Request, res: Response) => {
	try {
		const {
			fullName,
			username,
			password,
			mobileNo,
			gender
		}: UserSignupBody = req.body;

		if (password.length < 6) {
			res.status(400).json({ error: "Password should be at least 6 characters long" });
			return;
		}
		if (username.length < 2) {
			res.status(400).json({ error: "Name should be at least 2 characters long" });
			return;
		}
		if (mobileNo.length !== 10) {
			res.status(400).json({ error: "Enter a valid Mobile Number" });
			return;
		}
		if (gender !== "M" && gender !== "F" && gender !== "O") {
			res.status(400).json({ error: "Enter a gender" });
			return;
		}

		const sameUser = await User.findOne({ $or: [{ mobileNo }] });
		if (sameUser) {
			res.status(400).json({
				error: "A user with this mobile no. already exists. Use another mobile no., or try logging into your account."
			});
			return;
		}

		const salt = await bcrypt.genSalt(12);
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			username,
			password: passwordHash,
			mobileNo,
			gender
		});

		if (newUser) {
			await newUser.save();

			const token = generateTokenAndSetCookie(newUser._id, res);
			const payload = {
				token,
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				mobileNo: newUser.mobileNo,
				gender: newUser.gender
			}

			await client.set(`NX-user:${newUser._id}`, JSON.stringify(payload));
			await client.expire(`NX-user:${newUser._id}`, 30 * 24 * 60 * 60);

			res.status(201)
				.header("Authorization", `Bearer ${token}`)
				.json({
					_id: newUser._id,
					fullName: newUser.fullName,
					username: newUser.username,
					mobileNo: newUser.mobileNo,
					gender: newUser.gender,
					profilePic: newUser.profilePic,
					token
				});
		}
	} catch (error) {
		console.log("Error in Signup controller", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const { mobileNo, password }: UserLoginBody = req.body;
		if (mobileNo.length !== 10) {
			res.status(400).json({ error: "Enter a valid Mobile Number" });
			return;
		}

		const user = await User.findOne({ mobileNo });
		if (!user) {
			res.status(400).json({ error: "Cannot find User" });
			return;
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
		if (!isPasswordCorrect) {
			res.status(400).json({ error: "Invalid Login Credentials" });
			return;
		}

		res.cookie("NX-jwt", "", { maxAge: 0 });
		const token = generateTokenAndSetCookie(user._id, res);
		const payload = {
			token,
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			mobileNo: user.mobileNo,
			gender: user.gender
		}

		await client.set(`NX-user:${user._id}`, JSON.stringify(payload));
		await client.expire(`NX-user:${user._id}`, 30 * 24 * 60 * 60);

		res.status(201)
			.header("Authorization", `Bearer ${token}`)
			.json({
				_id: user._id,
				fullName: user.fullName,
				username: user.username,
				mobileNo: user.mobileNo,
				gender: user.gender,
				profilePic: user.profilePic,
				token
			});
	} catch (error) {
		console.log("Error in Login controller", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export const logout = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;

		res.cookie("NX-jwt", "", { maxAge: 0 });
		await client.del(`DB-user:${userId}`);

		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in Logout controller", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}