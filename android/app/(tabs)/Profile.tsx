import Header from '@/components/Header';
import { images } from '@/constants/images';
import { useAuthContext } from '@/context/AuthContext';
import useGetCloudinarySignature from '@/hooks/useGetCloudinarySignature';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker";
import Toast from 'react-native-toast-message';
import { uploadImageToCloudinary } from '@/utils/uploadImageToCloudinary';
import useUpdateProfile from '@/hooks/useUpdateProfile';

const Profile = () => {
	const { authUser } = useAuthContext();
	const [profilePic, setProfilePic] = useState(authUser?.profilePic || "");
	const [uploading, setUploading] = useState<boolean>(false);
	const { loading: signing, getCloudinarySignature } = useGetCloudinarySignature();
	const { loading, updateProfile } = useUpdateProfile();

	const handleImageUpload = async () => {
		setUploading(true);
		try {
			if (Platform.OS !== "web") {
				const { status } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== "granted") {
					Toast.show({
						type: "error",
						text1: "Permission to access gallery is required!",
						position: "top",
					});
					return;
				}
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			});
			if (result.canceled) return;

			const file = result.assets[0];

			const uploadedUrl = await uploadImageToCloudinary(
				file,
				getCloudinarySignature
			);

			if (!uploadedUrl) {
				Toast.show({
					type: "error",
					text1: "Couldn't upload image",
					position: "top",
				});
				return;
			}
			setProfilePic(uploadedUrl);

			await updateProfile(uploadedUrl);
		} catch (error) {
			console.log("Error in uploadiing image:", error);
			Toast.show({
				type: "error",
				text1: "Couldn't upload image",
				position: "top",
			});
		} finally {
			setUploading(false);
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-primary">
			<LinearGradient
				colors={["#000000", "#000000", "#0f0f0f", "#062612", "#0d4d24", "#16863a"]}
				locations={[0, 0.3, 0.55, 0.7, 0.9, 1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="flex-1"
			>
				<Header />

				<ScrollView
					className="flex-1 p-5"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						alignItems: "center",
						justifyContent: "center",
						paddingBottom: 50,
						paddingTop: 50
					}}
					keyboardShouldPersistTaps="handled"
				>
					<View className='glassmorphic p-6 rounded-xl flex-col items-center justify-center gap-2 w-[80%]'>
						<View>
							<Image
								source={
									profilePic
										? { uri: profilePic }
										: images.placeholder
								}
								className='size-52 mx-auto rounded-full border-2 border-accent-400'
							/>

							<TouchableOpacity
								onPress={handleImageUpload}
								className='bg-green-50 rounded-full absolute p-3 bottom-4 right-0 flex-row items-center justify-center'
								disabled={uploading || loading || signing}
							>
								{uploading || loading || signing ? (
									<ActivityIndicator
										size="small"
										color="#D1D5DB"
									/>
								) : (
									<MaterialCommunityIcons name="pen" size={24} color="#16a34a" />
								)}
							</TouchableOpacity>
						</View>

						<Text className='text-2xl text-accent-300 font-arimo-semibold text-center'>{authUser?.username}</Text>

						<View className='flex-col items-start justify-center'>
							<View className='w-full flex-row'>
								<Text className='text-profile-primary'>Name: </Text>
								<Text className='text-profile-secondary'>{authUser?.fullName}</Text>
							</View>

							<View className='w-full flex-row'>
								<Text className='text-profile-primary'>Mobile: </Text>
								<Text className='text-profile-secondary'>{authUser?.mobileNo}</Text>
							</View>

							<View className='w-full flex-row'>
								<Text className='text-profile-primary'>Gender: </Text>
								<Text className='text-profile-secondary'>{authUser?.gender === "M" ? "Male" : authUser?.gender === "F" ? "Female" : "Other"}</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			</LinearGradient>
		</SafeAreaView>
	)
}

export default Profile;