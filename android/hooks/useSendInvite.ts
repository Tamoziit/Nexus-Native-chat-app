import { useState } from "react";
import Toast from 'react-native-toast-message';
import cleanUpToken from "@/utils/cleanUpToken";
import { EXPO_API_URL } from "@/configs/env";

const useSendInvite = () => {
    const [loading, setLoading] = useState(false);
    const apiUrl = EXPO_API_URL;

    const sendInvite = async (id: string) => {
        const success = handleInputErrors(id);

        if (!success) return;

        const token = await cleanUpToken();
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/explore/send-invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error)
            }

            if (data) {
                Toast.show({
                    type: 'success',
                    text1: data.message,
                    position: 'top',
                });
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

    return { loading, sendInvite }
}

export default useSendInvite;


function handleInputErrors(id: string) {
    if (!id) {
        Toast.show({
            type: 'error',
            text1: "Cannot find ID of the User! Try again later.",
            position: 'top',
        });
        return false;
    }

    return true;
}