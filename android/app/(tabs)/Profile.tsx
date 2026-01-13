import Header from '@/components/Header';
import { images } from '@/constants/images';
import { useAuthContext } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
	const { authUser } = useAuthContext();

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
									authUser?.profilePic
										? { uri: authUser?.profilePic }
										: images.placeholder
								}
								className='size-52 mx-auto rounded-full border-2 border-accent-400'
							/>

							<TouchableOpacity
								className='bg-green-50 rounded-full absolute p-3 bottom-4 right-0 flex-row items-center justify-center'
							>
								<MaterialCommunityIcons name="pen" size={24} color="#16a34a" />
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