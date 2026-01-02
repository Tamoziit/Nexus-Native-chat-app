import { useAuthContext } from '@/context/AuthContext';
import { Chat } from '@/interfaces/interfaces';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import getEmojiCount from '@/utils/isEmojiOnly';

interface ChatProps {
	chat: Chat;
}

const ChatBox = ({ chat }: ChatProps) => {
	const { authUser } = useAuthContext();
	const forMe = chat.receiver === authUser?._id;
	const emojiCount = getEmojiCount(chat.message);
	const isBigEmoji = emojiCount > 0 && emojiCount <= 2;

	return (
		<View
			className={`w-full flex ${forMe ? 'items-start' : 'items-end'
				} my-0.5`}
		>
			<LinearGradient
				colors={
					forMe
						? ['#374151', '#1F2937']
						: ['#2563EB', '#1D4ED8']
				}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				className={`px-4 py-2 max-w-[75%] overflow-hidden rounded-2xl ${forMe ? 'rounded-tl-sm' : 'rounded-tr-sm'
					}`}
			>
				<Text
					className="text-gray-100 font-arimo-medium"
					style={{
						fontSize: isBigEmoji ? 36 : 16,
						lineHeight: isBigEmoji ? 42 : 22
					}}
				>
					{chat.message}
				</Text>
			</LinearGradient>
		</View>
	);
};

export default ChatBox;
