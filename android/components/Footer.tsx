import { footerLinks } from '@/constants/landingUI';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Linking } from 'react-native';

const Footer = () => {
	return (
		<View className='absolute bottom-0 left-0 bg-black/80 w-full flex-col items-center justify-center gap-4 p-4'>
			<View className='flex-col items-center gap-2'>
				<Text className='font-arimo-semibold text-accent-500 text-sm'>Powered by - TAMOJIT DAS</Text>
				<Text className='font-arimo-semibold text-green-700 text-sm'>&copy; Tamojit Das, 2024</Text>
			</View>

			<View className='w-[90%] h-[0.5px] bg-accent-600' />

			<View className='flex-row items-center justify-around w-full'>
				{footerLinks.map((item, _idx) => (
					<TouchableOpacity
						key={_idx}
						onPress={() => Linking.openURL(item.link)}
						activeOpacity={0.7}
					>
						<View className="flex-col items-center justify-center p-1">
							<MaterialCommunityIcons
								name={item.name}
								size={30}
								color="#16a34a"
							/>
							<Text className="font-arimo text-accent-600 text-xs">{item.title}</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
		</View>
	)
}

export default Footer;