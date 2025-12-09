import { icons } from '@/constants/icons';
import { TabIconProps } from '@/interfaces/interfaces';
import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';

const TabIcon = ({ focused, icon }: TabIconProps) => {
	if (focused) {
		return (
			<View className='w-full h-full justify-center items-center mt-4'>
				<View className='size-[90px] bg-[#000000] rounded-lg justify-center items-center'>
					<Image source={icon} tintColor="#ffffff" className='size-6' />
				</View>
			</View>
		)
	} else {
		return (
			<View className='w-full h-full justify-center items-center mt-4'>
				<Image source={icon} tintColor="#0f0f0f" className='size-5' />
			</View>
		)
	}
}

const _layout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarItemStyle: {
					width: '100%',
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center'
				},
				tabBarStyle: {
					backgroundColor: "#0f0f0f",
					borderRadius: 0,
					marginHorizontal: 0,
					marginBottom: 40,
					height: 52,
					position: 'absolute',
					overflow: 'hidden',
					borderWidth: 0.5,
					borderColor: '#0f0f0f'
				}
			}}
		>
			<Tabs.Screen
				name="Home"
				options={{
					title: 'Home',
					tabBarIcon: ({ focused }) => (
						<TabIcon
							focused={focused}
							icon={icons.home}
						/>
					),
					headerShown: false,
				}}
			/>
		</Tabs>
	)
}

export default _layout;