import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true
        }
    ]
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;