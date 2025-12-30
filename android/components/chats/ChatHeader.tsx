import { images } from '@/constants/images';
import { Participant } from '@/interfaces/interfaces';
import { View, Text, Image } from 'react-native';

interface ChatHeaderProps {
	friend: Participant | null;
}

const ChatHeader = ({ friend }: ChatHeaderProps) => {
	return (
		<View className='flex flex-row glassmorphic-2 w-full items-center justify-between py-3 px-6'>
			<View className='flex-row items-center gap-3'>
				<Image
					source={
						friend?.profilePic
							? { uri: friend?.profilePic }
							: images.placeholder
					}
					className='size-12 rounded-full border border-light-300'
					alt='profile_img'
					resizeMode='cover'
				/>

				<View className='flex-col'>
					<Text className='text-base text-accent-300 font-arimo-bold'>{friend?.username}</Text>
					<Text className='text-gray-400 text-sm font-arimo-semibold'>{friend?.fullName}</Text>
				</View>
			</View>
		</View>
	)
}

export default ChatHeader;