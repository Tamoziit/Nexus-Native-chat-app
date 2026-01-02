import { images } from '@/constants/images';
import { useAuthContext } from '@/context/AuthContext';
import { useSocketContext } from '@/context/SocketContext';
import { Conversation } from '@/interfaces/interfaces';
import formatMessageTime from '@/utils/formatMessageTime';
import { router } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ConversationCardProps {
	conversation: Conversation;
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
	const { authUser } = useAuthContext();
	const friend =
		conversation.participants.length === 2
			? conversation.participants.find(p => p._id !== authUser?._id)
			: null;
	const { onlineUsersSet } = useSocketContext();
	const isOnline = friend
		? onlineUsersSet.has(friend._id)
		: false;

	return (
		<TouchableOpacity
			onPress={() => router.push(`/(tabs)/chats/${conversation._id}`)}
			className='w-full glassmorphic-2 py-3 px-6 flex-row items-center justify-between'
		>
			<View className='flex-row items-center gap-2'>
				<View>
					<Image
						source={
							friend?.profilePic
								? { uri: friend?.profilePic }
								: images.placeholder
						}
						className='size-16 rounded-full border border-light-300'
						alt='profile_img'
						resizeMode='cover'
					/>
					<View
						className={`${isOnline ? "block" : "hidden"} absolute left-1 -top-1 size-4 rounded-full bg-accent-400`}
					/>
				</View>

				<View className='flex-col gap-1'>
					<Text
						className='text-lg text-accent-300 font-arimo-bold'
						numberOfLines={1}
						ellipsizeMode='tail'
					>
						{friend?.username}
					</Text>
					<Text
						className='text-gray-400 text-sm font-arimo-semibold'
						numberOfLines={1}
						ellipsizeMode='tail'
					>
						{conversation.latestMessage.message}
					</Text>
				</View>
			</View>

			<View>
				<Text className='text-gray-500 text-sm font-arimo-semibold'>{formatMessageTime(conversation.latestMessage.createdAt)}</Text>
			</View>
		</TouchableOpacity>
	)
}

export default ConversationCard;