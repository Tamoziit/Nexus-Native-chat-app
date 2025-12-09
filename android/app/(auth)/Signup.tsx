import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '@/constants/images';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUserSignup from '@/hooks/useSignup';
import { router } from 'expo-router';

const Signup = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		mobileNo: "",
		password: "",
		gender: ""
	});
	const [showPassword, setShowPassword] = useState(false);
	const { loading, signup } = useUserSignup();

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	};

	const handleInputChange = (key: keyof typeof inputs, value: string) => {
		setInputs(prev => ({ ...prev, [key]: value }));
	};

	const handleSubmit = async () => {
		await signup(inputs);
	}

	return (
		<SafeAreaView className="flex-1 bg-primary">
			<LinearGradient
				colors={["#000000", "#000000", "#0f0f0f", "#062612", "#0d4d24", "#16863a"]}
				locations={[0, 0.3, 0.55, 0.7, 0.9, 1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="flex-1"
			>
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
					<View className='flex flex-col glassmorphic p-5 gap-6 rounded-lg w-full items-center'>
						<View className="flex flex-row gap-3 items-center justify-center">
							<Image source={images.Logo} className="size-16 mx-auto" />
							<View className="flex flex-row gap-0.5 items-center">
								<Text className="text-accent-500 text-4xl font-bitcount">NEXUS</Text>
							</View>
						</View>

						<View className="gap-2 w-full">
							<View className="flex flex-row items-center gap-2">
								<MaterialCommunityIcons name="card-account-details" size={20} color="#34d399" />
								<Text className="text-light-100 text-lg font-arimo-medium">Full Name</Text>
							</View>
							<TextInput
								className="input-primary px-6 py-4 font-arimo"
								placeholder="Enter your Full name"
								placeholderTextColor="#6B7280"
								value={inputs.fullName}
								onChangeText={text => handleInputChange('fullName', text)}
							/>
						</View>

						<View className="gap-2 w-full">
							<View className="flex flex-row items-center gap-2">
								<MaterialCommunityIcons name="account-circle-outline" size={20} color="#34d399" />
								<Text className="text-light-100 text-lg font-arimo-medium">Username</Text>
							</View>
							<TextInput
								className="input-primary px-6 py-4 font-arimo"
								placeholder="Enter your username"
								placeholderTextColor="#6B7280"
								value={inputs.username}
								onChangeText={text => handleInputChange('username', text)}
							/>
						</View>

						<View className="gap-2 w-full">
							<View className="flex flex-row items-center gap-2">
								<MaterialCommunityIcons name="phone" size={20} color="#34d399" />
								<Text className="text-light-100 text-lg font-arimo-medium">Mobile Number</Text>
							</View>
							<TextInput
								className="input-primary px-6 py-4 font-arimo"
								placeholder="Enter your mobile number"
								placeholderTextColor="#6B7280"
								keyboardType="phone-pad"
								value={inputs.mobileNo}
								onChangeText={text => handleInputChange('mobileNo', text)}
							/>
						</View>

						<View className="gap-2 w-full">
							<View className="flex flex-row items-center gap-2">
								<MaterialCommunityIcons name="lock" size={20} color="#34d399" />
								<Text className="text-light-100 text-lg font-arimo-medium">Password</Text>
							</View>
							<View className="flex flex-row items-center">
								<TextInput
									className="input-primary flex-1 px-6 py-4 font-arimo"
									placeholder="Enter your password"
									placeholderTextColor="#6B7280"
									secureTextEntry={!showPassword}
									value={inputs.password}
									onChangeText={text => handleInputChange('password', text)}
								/>
								<TouchableOpacity onPress={togglePasswordVisibility} className="absolute right-4">
									<MaterialCommunityIcons
										name={showPassword ? "eye-off" : "eye"}
										size={20}
										color="#34d399"
									/>
								</TouchableOpacity>
							</View>
						</View>

						<View className="gap-2 w-full">
							<View className="flex flex-row items-center gap-2">
								<MaterialCommunityIcons name="gender-male-female" size={20} color="#34d399" />
								<Text className="text-light-100 text-lg font-arimo-medium">Gender</Text>
							</View>
							<View className="flex flex-row px-2 py-2 justify-between">
								{["Male", "Female", "Other"].map((g) => (
									<TouchableOpacity
										key={g}
										className="flex flex-row items-center gap-2"
										onPress={() => handleInputChange("gender", g[0])}
									>
										<View
											className={`w-5 h-5 rounded-full border-2 border-gray-400 items-center justify-center`}
										>
											{inputs.gender === g[0] && <View className="w-3 h-3 rounded-full bg-gray-300" />}
										</View>
										<Text className="text-light-100 font-arimo">{g}</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						<View className='w-full flex items-center gap-3 flex-col'>
							<TouchableOpacity
								className="btn-primary items-center w-full"
								style={{
									paddingVertical: 10,
									marginTop: 6
								}}
								onPress={handleSubmit}
								disabled={loading}
							>
								{loading ? (
									<ActivityIndicator
										size="small"
										color="#D1D5DB"
									/>
								) : (
									<Text className="text-xl text-gray-200 font-arimo-bold">Signup</Text>
								)}
							</TouchableOpacity>

							<View className="flex flex-row items-center gap-1 mt-1">
								<Text className="text-light-200 font-arimo">
									Already have an account?
								</Text>
								<TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
									<Text className="text-accent-400 font-arimo-bold">
										Log In
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ScrollView>
			</LinearGradient>
		</SafeAreaView>
	)
}

export default Signup;