import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cipherText: {
        type: String,
        required: true
    },
    nonce: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;