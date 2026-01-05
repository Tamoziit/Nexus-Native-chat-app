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
    cipherTextSender: {
        type: String,
        required: true
    },
    nonceSender: {
        type: String,
        required: true
    },
    cipherTextReceiver: {
        type: String,
        required: true
    },
    nonceReceiver: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;