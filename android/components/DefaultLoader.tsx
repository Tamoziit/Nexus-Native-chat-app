import { LinearGradient } from 'expo-linear-gradient';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DefaultLoader = () => {
	return (
		<SafeAreaView className="flex-1 bg-primary">
			<LinearGradient
				colors={["#000000", "#000000", "#0f0f0f", "#062612", "#0d4d24", "#16863a"]}
				locations={[0, 0.3, 0.55, 0.7, 0.9, 1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="flex-1"
			>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#34d399" />
				</View>
			</LinearGradient>
		</SafeAreaView>
	);
}

export default DefaultLoader;