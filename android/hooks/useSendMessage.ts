import { useState } from "react"
import Toast from 'react-native-toast-message';
import { SendChatProps } from "@/interfaces/interfaces";
import cleanUpToken from "@/utils/cleanUpToken";
import { EXPO_API_URL } from "@/configs/env";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const apiUrl = EXPO_API_URL;

    const sendMessage = async ({ conversationId, message }: SendChatProps) => {
        const success = handleInputErrors({ conversationId, message });

        if (!success) return;

        const token = await cleanUpToken();
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/chats/send-message/${conversationId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error)
            }

            if (data) {
                return data;
            }
        } catch (error) {
            if (error instanceof Error) {
                Toast.show({
                    type: 'error',
                    text1: error.message,
                    position: 'top',
                });
                console.log(error);
            } else {
                console.log("An unknown error occurred", error);
            }
        } finally {
            setLoading(false);
        }
    }

    return { loading, sendMessage }
}

export default useSendMessage;


function handleInputErrors({ conversationId, message }: SendChatProps) {
    if (!message) {
        Toast.show({
            type: 'error',
            text1: "Please enter a message",
            position: 'top',
        });
        return false;
    }

    if (!conversationId) {
        Toast.show({
            type: 'error',
            text1: "Error in sending message",
            position: 'top',
        });
        return false;
    }

    return true;
}