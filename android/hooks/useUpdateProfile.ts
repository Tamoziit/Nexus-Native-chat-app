import { useState } from "react"
import { useAuthContext } from "../context/AuthContext";
import Toast from 'react-native-toast-message';
import cleanUpToken from "@/utils/cleanUpToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_API_URL } from "@/configs/env";

const useUpdateProfile = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();
    const apiUrl = EXPO_API_URL;

    const updateProfile = async (profilePic: string) => {
        const success = handleInputErrors(profilePic);

        if (!success) return;

        const token = await cleanUpToken();
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/profile/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ profilePic })
            });
            const data = await res.json();

            if (data.error) {
                throw new Error(data.error)
            }

            if (data) {
                const now = new Date().getTime();
                const expiry = now + 30 * 24 * 60 * 60 * 1000;

                await Promise.all([
                    AsyncStorage.setItem("NX-token", data.token),
                    AsyncStorage.setItem("NX-user", JSON.stringify(data)),
                    AsyncStorage.setItem("NX-expiry", expiry.toString())
                ]);
                setAuthUser(data);

                Toast.show({
                    type: 'success',
                    text1: 'Logged in successfully!',
                    text2: 'Welcome back to NEXUS',
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

    return { loading, updateProfile }
}

export default useUpdateProfile;


function handleInputErrors(profilePic: string) {
    if (!profilePic) {
        Toast.show({
            type: 'error',
            text1: "Please select an image",
            position: 'top',
        });
        return false;
    }

    return true;
}