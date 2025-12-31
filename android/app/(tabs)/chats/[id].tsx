import {
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import useGetUserChatsById from "@/hooks/useGetUserChatsById";
import DefaultLoader from "@/components/DefaultLoader";
import { Participant, SocketMessageProps, UserChats } from "@/interfaces/interfaces";
import { useAuthContext } from "@/context/AuthContext";
import ChatHeader from "@/components/chats/ChatHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useSendMessage from "@/hooks/useSendMessage";
import { useSocketContext } from "@/context/SocketContext";

const Chat = () => {
	const [userChat, setUserChat] = useState<UserChats | null>(null);
	const { loading, getUserChatsById } = useGetUserChatsById();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { authUser } = useAuthContext();
	const [friend, setFriend] = useState<Participant | null>(null);
	const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const { loading: sending, sendMessage } = useSendMessage();
	const { socket } = useSocketContext();
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState<boolean>(false);

	const fetchUserChatsById = async () => {
		const data = (await getUserChatsById(id)) as UserChats;
		const friendData =
			data.participants.length === 2
				? data.participants.find(p => p._id !== authUser?._id) ?? null
				: null;

		setUserChat(data);
		setFriend(friendData);
	}

	useEffect(() => {
		fetchUserChatsById();
	}, [id]);

	const onRefresh = async () => {
		setRefreshing(true);
		fetchUserChatsById();
		setRefreshing(false);
	};

	const handleSendMessage = async () => {
		if (!userChat) return;

		const chat = await sendMessage({
			conversationId: userChat._id,
			message
		});
		setUserChat((prev) =>
			prev
				? { ...prev, chats: [...prev.chats, chat] }
				: prev
		);

		Keyboard.dismiss();
		setMessage("");
	}

	useEffect(() => {
		if (!socket || !userChat) return;

		const handleNewChat = ({
			conversationId,
			chat
		}: SocketMessageProps) => {
			if (conversationId !== userChat._id) return;

			setUserChat((prev) =>
				prev
					? { ...prev, chats: [...prev.chats, chat] }
					: prev
			);
		}

		socket.on("newChatMessage", handleNewChat);

		return () => {
			socket.off("newChatMessage", handleNewChat);
		};
	}, [socket, userChat?._id]);

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
						<FlatList
							data={userChat.chats}
							keyExtractor={(item) => item._id.toString()}
							ItemSeparatorComponent={() => <View className="h-4" />}
							contentContainerStyle={{
								marginTop: 10,
								paddingBottom: Math.max(insets.bottom, 100)
							}}
							ListEmptyComponent={
								<Text className="text-gray-400 text-center">No accounts found.</Text>
							}
							renderItem={({ item }) => (
								<Text className="text-gray-400">
									{item.sender} : {item.message}
								</Text>
							)}
							showsVerticalScrollIndicator={false}
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
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
								onPress={handleSendMessage}
								disabled={sending || loading}
							>
								{sending ? (
									<ActivityIndicator
										size="small"
										color="#166534"
									/>
								) : (
									<MaterialCommunityIcons
										name='send'
										size={22}
										color="#166534"
									/>
								)}
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>
				</LinearGradient>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};

export default Chat;