import { Server } from "socket.io";
import http from "http";
import express from "express";
import client from "../redis/client";
import { getUserFriends } from "../utils/socketHelpers";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: [
            "GET",
            "POST",
            "PATCH",
            "DELETE"
        ]
    }
});

io.on("connection", async (socket) => {
    let userId = socket.handshake.query.userId;
    if (Array.isArray(userId)) {
        userId = userId[0];
    }

    if (userId) {
        await client.hset("ONLINE_USERS", userId, socket.id);
        console.log(`User ${userId} connected with socket ID ${socket.id}`);
        socket.join(userId);
    } else return;

    const friends = await getUserFriends(userId);
    const onlineUsers = await client.hkeys("ONLINE_USERS");
    
    const onlineFriends = friends.filter(friendId =>
        onlineUsers.includes(friendId)
    );
    socket.emit("onlineUsers", onlineFriends);
    console.log(`${userId}: ${onlineFriends}`);

    socket.on("disconnect", async () => {
        if (userId) {
            console.log(`User ${userId} disconnected`);
            await client.hdel("player_sockets", userId);
        }
    });
});

export { app, io, server };