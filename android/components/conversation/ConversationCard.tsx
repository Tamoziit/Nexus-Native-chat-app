import { images } from '@/constants/images';
import { useAuthContext } from '@/context/AuthContext';
import { useSocketContext } from '@/context/SocketContext';
import { Conversation } from '@/interfaces/interfaces';
import formatMessageTime from '@/utils/formatMessageTime';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import decryptMessageOnRender from '@/utils/decryptMessageOnRender';

interface ConversationCardProps {
	conversation: Conversation;
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
	const { authUser } = useAuthContext();
	const friend =
		conversation.participants.length === 2
			? conversation.participants.find(p => p._id !== authUser?._id)
			: null;
	const isMe = conversation.latestMessage.sender === authUser?._id;
	const { onlineUsersSet } = useSocketContext();
	const isOnline = friend
		? onlineUsersSet.has(friend._id)
		: false;
	const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);

	useEffect(() => {
		if (!authUser) return;
		let mounted = true;

		const run = async () => {
			const plainText = await decryptMessageOnRender({
				authUser,
				isMe,
				participants: conversation.participants,
				chat: conversation.latestMessage
			});

			if (mounted) {
				setDecryptedMessage(plainText ?? null);
			}
		};
		run();

		return () => {
			mounted = false;
		};
	}, [authUser, isMe, conversation.participants, conversation.latestMessage]);

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
						{decryptedMessage ?? '...Error: 🔒 Encrypted...'}
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