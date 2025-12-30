import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import useGetUserChatsById from '@/hooks/useGetUserChatsById';
import DefaultLoader from '@/components/DefaultLoader';
import { Participant, UserChats } from '@/interfaces/interfaces';
import { useAuthContext } from '@/context/AuthContext';
import ChatHeader from '@/components/chats/ChatHeader';

const Chat = () => {
	const [userChat, setUserChat] = useState<UserChats | null>(null);
	const { loading, getUserChatsById } = useGetUserChatsById();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { authUser } = useAuthContext();
	const [friend, setFriend] = useState<Participant | null>(null);

	const fetchUserChats = async () => {
		const data = (await getUserChatsById(id)) as UserChats;

		const friendData: Participant | null =
			data.participants.length === 2
				? data.participants.find(p => p._id !== authUser?._id) ?? null
				: null;

		setUserChat(data);
		setFriend(friendData);
	};

	useEffect(() => {
		fetchUserChats();
	}, []);

	if (loading || !userChat) {
		return <DefaultLoader />;
	}

	console.log(userChat);

	return (
		<SafeAreaView className="flex-1 bg-primary">
			<LinearGradient
				colors={["#000000", "#000000", "#0f0f0f", "#062612", "#0d4d24", "#16863a"]}
				locations={[0, 0.3, 0.55, 0.7, 0.9, 1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="flex-1"
			>
				<ChatHeader friend={friend} />
			</LinearGradient>
		</SafeAreaView>
	)
}

export default Chat;