import { images } from '@/constants/images';
import { useAuthContext } from '@/context/AuthContext';
import { Conversation } from '@/interfaces/interfaces';
import { View, Text, Image } from 'react-native';

interface ConversationCardProps {
	conversation: Conversation;
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
	const { authUser } = useAuthContext();
	const friend =
		conversation.participants.length === 2
			? conversation.participants.find(p => p._id !== authUser?._id)
			: null;

	return (
		<View className='w-full glassmorphic rounded-lg p-3 flex-row items-center justify-between'>
			<View className='flex-row items-center gap-2'>
				<Image
					source={
						friend?.profilePic
							? { uri: friend?.profilePic }
							: images.placeholder
					}
					className='size-20 rounded-full border border-light-300'
					alt='profile_img'
					resizeMode='cover'
				/>
			</View>
		</View>
	)
}

export default ConversationCard;