import type { ReactNode } from "react";

export interface UserSignupParams {
    fullName: string;
    username: string;
    password: string;
    mobileNo: string;
    gender: string;
}

export interface LoginParams {
    mobileNo: string;
    password: string;
}

export interface AuthUser {
    _id: string;
    fullName: string;
    username: string;
    password: string;
    mobileNo: string;
    profilePic?: string | null;
    gender: "M" | "F" | "O";
}

export interface AuthContextType {
    authUser: AuthUser | null;
    setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
    loading: boolean;
}

export interface AuthContextProviderProps {
    children: ReactNode;
}

export interface TabIconProps {
    focused: boolean;
    icon: any;
}

export interface Account {
    _id: string;
    fullName: string;
    username: string;
    mobileNo: string;
    profilePic?: string | null;
    gender: "M" | "F" | "O";
}

export interface Participant {
    _id: string;
    username: string;
    fullName?: string | null;
    profilePic?: string | null;
    publicKey?: string | null;
}

export interface Chat {
    _id: string;
    sender: string;
    receiver: string;
    cipherTextSender: string;
    nonceSender: string;
    cipherTextReceiver: string;
    nonceReceiver: string;
    createdAt: string;
}

export interface Conversation {
    _id: string;
    participants: Participant[];
    latestMessage: Chat;
}

export interface UserChats {
    _id: string;
    participants: Participant[];
    chats: Chat[];
}

export interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
    onlineUsersSet: Set<string>;
}

export interface SocketProviderProps {
    children: ReactNode;
}

export interface SendChatProps {
    conversationId: string;
    message: string;
    receiverPublicKey: string;
    senderPublicKey: string;
}

export interface SocketMessageProps {
    conversationId: string;
    chat: Chat;
}

export interface DecryptMessageProps {
    myPrivateKey: string;
    authUser: AuthUser,
    isMe: boolean,
    participants: Participant[],
    chat: Chat;
}

interface ChatProps {
    chat: Chat;
    participants: Participant[];
    onLayout?: () => void;
    myPrivateKey: string;
}