import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { EXPO_CLOUDINARY_IMAGE_URL, EXPO_CLOUDINARY_PRESET } from "@/configs/env";
import { CloudinarySignature } from "@/interfaces/interfaces";
import resizeImage from "./resizeImage";
import { ImagePickerAsset } from "expo-image-picker";

const getFileNameFromUri = (uri: string) =>
    uri.split("/").pop() ?? `image_${Date.now()}.jpg`;

export const uploadImageToCloudinary = async (
    file: ImagePickerAsset,
    getCloudinarySignature: () => Promise<CloudinarySignature>
): Promise<string | null> => {
    try {
        if (!file?.uri) {
            throw new Error("Invalid file");
        }

        let finalUri = file.uri;

        if (Platform.OS !== "web") {
            finalUri = await resizeImage(file.uri);
        }

        const { timestamp, signature, api_key } = await getCloudinarySignature();

        const formData = new FormData();

        formData.append("file", {
            uri: finalUri,
            type: file.mimeType || "image/jpeg",
            name: getFileNameFromUri(finalUri),
        } as any);

        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("api_key", api_key);
        formData.append("upload_preset", EXPO_CLOUDINARY_PRESET);

        const res = await fetch(EXPO_CLOUDINARY_IMAGE_URL, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data?.error?.message || "Upload failed");
        }

        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        Toast.show({
            type: "error",
            text1: "Couldn't upload image",
            position: "top",
        });

        return null;
    }
};