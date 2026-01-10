import Header from '@/components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
	return (
		<SafeAreaView className="flex-1 bg-primary">
			<LinearGradient
				colors={["#000000", "#000000", "#0f0f0f", "#062612", "#0d4d24", "#16863a"]}
				locations={[0, 0.3, 0.55, 0.7, 0.9, 1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="flex-1"
			>
				<Header />
				
				<ScrollView
					className="flex-1 p-5"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						minHeight: "100%",
						alignItems: "center",
						justifyContent: "center",
						paddingBottom: 30
					}}
					keyboardShouldPersistTaps="handled"
				>
				</ScrollView>
			</LinearGradient>
		</SafeAreaView>
	)
}

export default Profile;