import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { images } from '@/constants/images';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useLogout from '@/hooks/useLogout';

const Header = () => {
	const { loading, logout } = useLogout();

	return (
		<View className='flex flex-row w-full items-center justify-between py-3 px-6' style={{backgroundColor: "#0f0f0f"}}>
			<View className="flex flex-row gap-3 items-center justify-center">
				<Image source={images.Logo} className="size-10 mx-auto" />
				<View className="flex flex-row gap-0.5 items-center">
					<Text className="text-accent-500 text-2xl font-bitcount">NEXUS</Text>
				</View>
			</View>

			<TouchableOpacity
				onPress={logout}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator
						size="small"
						color="#3b82f6"
					/>
				) : (
					<MaterialCommunityIcons name="logout" size={20} color="#16a34a" />
				)}
			</TouchableOpacity>
		</View>
	)
}

export default Header;