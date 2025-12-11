import { images } from '@/constants/images';
import useAcceptInvite from '@/hooks/useAcceptInvite';
import { Account } from '@/interfaces/interfaces';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

interface AccountCardProps {
	account: Account;
}

const FriendRequestCard = ({ account }: AccountCardProps) => {
	const { loading, acceptInvite } = useAcceptInvite();

	return (
		<View className='w-full glassmorphic rounded-lg p-3 flex-row items-center justify-between'>
			<View className='flex-row items-center gap-2'>
				<Image
					source={
						account.profilePic
							? { uri: account.profilePic }
							: images.placeholder
					}
					className='size-20 rounded-full border border-light-300'
					alt='profile_img'
					resizeMode='cover'
				/>

				<View>
					<Text className='text-lg text-accent-300 font-arimo-bold'>{account.username}</Text>
					<Text className='text-gray-400 text-sm font-arimo-semibold'>{account.fullName}</Text>
					<Text className='text-gray-500 text-sm font-arimo'>
						{account.mobileNo}&nbsp;
						<MaterialCommunityIcons
							name={account.gender === "M" ? "gender-male" : (account.gender === "F" ? "gender-female" : "gender-non-binary")}
							size={16}
						/>
					</Text>
				</View>
			</View>

			<TouchableOpacity
				onPress={() => acceptInvite(account._id)}
				className='btn-secondary !py-1.5'
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator
						size="small"
						color="#16a34a"
					/>
				) : (
					<View className='flex-row items-center gap-1'>
						<Text className='text-accent-500 text-sm font-arimo-semibold'>Accept</Text>
						<MaterialCommunityIcons
							name="check-decagram-outline"
							size={16}
							color="#16a34a"
						/>
					</View>
				)}
			</TouchableOpacity >
		</View >
	)
}

export default FriendRequestCard;