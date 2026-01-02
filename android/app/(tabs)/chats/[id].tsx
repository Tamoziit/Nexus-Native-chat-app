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
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import useGetUserChatsById from "@/hooks/useGetUserChatsById";
import DefaultLoader from "@/components/DefaultLoader";
import { Participant, SocketMessageProps, UserChats } from "@/interfaces/interfaces";
import { useAuthContext } from "@/context/AuthContext";
import ChatHeader from "@/components/chats/ChatHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useSendMessage from "@/hooks/useSendMessage";
import { useSocketContext } from "@/context/SocketContext";
import ChatBox from "@/components/chats/ChatBox";

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
	const [inputHeight, setInputHeight] = useState(48); // base input height
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const flatListRef = useRef<FlatList>(null);

	const MIN_HEIGHT = 48;
	const MAX_HEIGHT = 120;
	const borderRadius = inputHeight > 80 ? 16 : 999; // input border radius

	const scrollToEnd = () => {
		flatListRef.current?.scrollToEnd({ animated: true });
	};

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

	useEffect(() => {
		if (userChat?.chats.length) {
			// Small delay to ensure FlatList has rendered
			setTimeout(scrollToEnd, 100);
		}
	}, [userChat?.chats.length]);

	const onRefresh = async () => {
		setRefreshing(true);
		fetchUserChatsById();
		setRefreshing(false);
	};

	const handleSendMessage = async () => {
		if (!userChat) return;

		const chat = await sendMessage({
			conversationId: userChat._id,
			message: message.trim()
		});

		if (!chat) return;
		setUserChat((prev) =>
			prev
				? { ...prev, chats: [...prev.chats, chat] }
				: prev
		);

		Keyboard.dismiss();
		setMessage("");
		setTimeout(scrollToEnd, 100);
	}

	useEffect(() => {
		if (!socket || !userChat) return;

		const handleNewChat = ({
			conversationId,
			chat
		}: SocketMessageProps) => {
			if (conversationId !== userChat._id || !chat) return;

			setUserChat((prev) =>
				prev
					? { ...prev, chats: [...prev.chats, chat] }
					: prev
			);

			setTimeout(scrollToEnd, 100);
		}

		socket.on("newChatMessage", handleNewChat);

		return () => {
			socket.off("newChatMessage", handleNewChat);
		};
	}, [socket, userChat?._id]);

	if (loading || !userChat) return <DefaultLoader />;

	return (
		<SafeAreaView className="flex-1 bg-primary">
			<LinearGradient
				colors={["#000000", "#000000", "#0f0f0f", "#062612", "#0d4d24", "#16863a"]}
				className="flex-1"
			>
				<ChatHeader friend={friend} />

				<View className="flex-1 px-5">
					<FlatList
						ref={flatListRef}
						data={userChat.chats}
						keyExtractor={(item) => item._id.toString()}
						ItemSeparatorComponent={() => <View className="h-1" />}
						contentContainerStyle={{
							marginTop: 10,
							paddingBottom: 30
						}}
						ListEmptyComponent={
							<Text className="text-gray-400 text-center">Start Chatting...</Text>
						}
						renderItem={({ item }) => <ChatBox chat={item} />}
						showsVerticalScrollIndicator={false}
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				</View>

				<TouchableWithoutFeedback
					onPress={Keyboard.dismiss}
					accessible={false}
				>
					<KeyboardAvoidingView
						behavior={Platform.OS === "android" ? "padding" : "height"}
						keyboardVerticalOffset={isInputFocused ? 30 : 0}
					>
						<View className="px-3 pb-3 w-full flex-row items-center justify-center gap-2">
							<TextInput
								multiline
								textAlignVertical="top"
								placeholder="Message..."
								placeholderTextColor="#6B7280"
								value={message}
								onChangeText={setMessage}
								onContentSizeChange={(e) => {
									const height = Math.min(
										MAX_HEIGHT,
										Math.max(MIN_HEIGHT, e.nativeEvent.contentSize.height)
									);
									setInputHeight(height);
								}}
								style={{
									height: inputHeight,
									borderRadius,
								}}
								onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)}
								className="input-secondary px-6 py-3.5 font-arimo-semibold text-lg w-[85%]"
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
				</TouchableWithoutFeedback>
			</LinearGradient>
		</SafeAreaView>
	);
};

export default Chat;