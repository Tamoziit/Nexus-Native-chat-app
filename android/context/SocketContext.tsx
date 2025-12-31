import { createContext, useContext, useEffect, useState, } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import { EXPO_SOCKET_URL } from "@/configs/env";
import { SocketContextType, SocketProviderProps } from "@/interfaces/interfaces";

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocketContext must be used within a SocketContextProvider");
    }
    return context;
};

export const SocketContextProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const { authUser } = useAuthContext();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const socketUrl = EXPO_SOCKET_URL;

    useEffect(() => {
        if (authUser) {
            const newSocket = io(socketUrl, {
                query: {
                    userId: authUser._id,
                },
            });

            setSocket(newSocket);

            newSocket.on("onlineUsers", (users: string[]) => {
                setOnlineUsers(users);
            });

            return () => {
                newSocket.close();
                setSocket(null);
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};