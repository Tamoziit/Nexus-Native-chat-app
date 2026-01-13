import { useState } from "react"
import Toast from 'react-native-toast-message';
import { SendChatProps } from "@/interfaces/interfaces";
import cleanUpToken from "@/utils/cleanUpToken";
import { EXPO_API_URL } from "@/configs/env";
import * as SecureStore from 'expo-secure-store';
import { encryptMessage } from "@/utils/crypto";
import { useAuthContext } from "@/context/AuthContext";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const apiUrl = EXPO_API_URL;
    const { authUser } = useAuthContext();

    const sendMessage = async ({ conversationId, message, receiverPublicKey, senderPublicKey }: SendChatProps) => {
        const success = handleInputErrors({ conversationId, message, receiverPublicKey, senderPublicKey });

        if (!success) return;

        const token = await cleanUpToken();
        const myPrivateKey = await SecureStore.getItemAsync(`NEMESIS_PRIVATE_IDENTITY_KEY_${authUser?._id}`);
        if (!myPrivateKey) return;

        // Double Encryption
        const encryptedMessageForSender = encryptMessage(myPrivateKey, senderPublicKey, message);
        const encryptedMessageForReceiver = encryptMessage(myPrivateKey, receiverPublicKey, message);

        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/chats/send-message/${conversationId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    cipherTextSender: encryptedMessageForSender.cipherText,
                    nonceSender: encryptedMessageForSender.nonce,
                    cipherTextReceiver: encryptedMessageForReceiver.cipherText,
                    nonceReceiver: encryptedMessageForReceiver.nonce
                })
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


function handleInputErrors({ conversationId, message, receiverPublicKey, senderPublicKey }: SendChatProps) {
    if (!message) {
        Toast.show({
            type: 'error',
            text1: "Please enter a message",
            position: 'top',
        });
        return false;
    }

    if (!conversationId || !receiverPublicKey || !senderPublicKey) {
        Toast.show({
            type: 'error',
            text1: "Error in sending message",
            position: 'top',
        });
        return false;
    }

    return true;
}