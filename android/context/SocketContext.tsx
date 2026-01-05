import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import { EXPO_SOCKET_URL } from "@/configs/env";
import {
    SocketContextType,
    SocketProviderProps,
} from "@/interfaces/interfaces";

export const SocketContext =
    createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error(
            "useSocketContext must be used within a SocketContextProvider"
        );
    }
    return context;
};

export const SocketContextProvider: React.FC<SocketProviderProps> = ({
    children,
}) => {
    const { authUser } = useAuthContext();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    const socketUrl = EXPO_SOCKET_URL;

    // O(1) lookup for online status
    const onlineUsersSet = useMemo(
        () => new Set(onlineUsers),
        [onlineUsers]
    );

    useEffect(() => {
        if (!authUser?._id) return;

        const newSocket = io(socketUrl, {
            transports: ["websocket"],
            query: {
                userId: authUser._id,
            },
        });

        setSocket(newSocket);

        const handleOnlineUsers = (users: string[]) => {
            setOnlineUsers(users);
        };

        const handleNewOnlineFriend = ({ userId }: { userId: string }) => {
            setOnlineUsers(prev =>
                prev.includes(userId) ? prev : [...prev, userId]
            );
        };

        const handleFriendOffline = ({ userId }: { userId: string }) => {
            setOnlineUsers(prev => prev.filter(id => id !== userId));
        };

        newSocket.on("onlineUsers", handleOnlineUsers);
        newSocket.on("friendOnline", handleNewOnlineFriend);
        newSocket.on("friendOffline", handleFriendOffline);

        return () => {
            newSocket.off("onlineUsers", handleOnlineUsers);
            newSocket.off("friendOnline", handleNewOnlineFriend);
            newSocket.off("friendOffline", handleFriendOffline);
            newSocket.disconnect();
            setSocket(null);
            setOnlineUsers([]);
        };
    }, [authUser?._id]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                onlineUsers,
                onlineUsersSet,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};