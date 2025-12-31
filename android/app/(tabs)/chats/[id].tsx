import {
	View,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import useGetUserChatsById from "@/hooks/useGetUserChatsById";
import DefaultLoader from "@/components/DefaultLoader";
import { Participant, UserChats } from "@/interfaces/interfaces";
import { useAuthContext } from "@/context/AuthContext";
import ChatHeader from "@/components/chats/ChatHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Chat = () => {
	const [userChat, setUserChat] = useState<UserChats | null>(null);
	const { loading, getUserChatsById } = useGetUserChatsById();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { authUser } = useAuthContext();
	const [friend, setFriend] = useState<Participant | null>(null);
	const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");

	useEffect(() => {
		(async () => {
			const data = (await getUserChatsById(id)) as UserChats;
			const friendData =
				data.participants.length === 2
					? data.participants.find(p => p._id !== authUser?._id) ?? null
					: null;
			
			setUserChat(data);
			setFriend(friendData);
		})();
	}, [id]);

	const sendMessage = async() => {
		console.log(message);
		Keyboard.dismiss();
		setMessage("");
	}

	if (loading || !userChat) return <DefaultLoader />;

	return (
		<TouchableWithoutFeedback
			onPress={Keyboard.dismiss}
			accessible={false}
		>
			<SafeAreaView className="flex-1 bg-primary">
				<LinearGradient
					colors={["#000000", "#000000", "#0f0f0f", "#062612", "#0d4d24", "#16863a"]}
					className="flex-1"
				>
					<ChatHeader friend={friend} />

					<View className="flex-1 px-4">
						{/** TODO: Messages */}
					</View>

					<KeyboardAvoidingView
						behavior={Platform.OS === "android" ? "padding" : "height"}
						keyboardVerticalOffset={isInputFocused ? 30 : 0}
					>
						<View className="px-3 pb-3 w-full flex-row items-center justify-center gap-2">
							<TextInput
								className="input-secondary px-6 py-3.5 font-arimo-semibold text-lg w-[85%]"
								placeholder="Message..."
								placeholderTextColor="#6B7280"
								onFocus={() => setIsInputFocused(true)}
								onBlur={() => setIsInputFocused(false)}
								value={message}
								onChangeText={text => setMessage(text)}
							/>

							<TouchableOpacity
								className="btn-tertiary rounded-full p-3.5"
								onPress={sendMessage}
							>
								<MaterialCommunityIcons
									name='send'
									size={22}
									color="#166534"
								/>
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>
				</LinearGradient>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};

export default Chat;