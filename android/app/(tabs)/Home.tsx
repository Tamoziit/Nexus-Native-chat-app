import ConversationCard from '@/components/conversation/ConversationCard';
import DefaultLoader from '@/components/DefaultLoader';
import Header from '@/components/Header';
import useGetConversations from '@/hooks/useGetConversations';
import { Conversation } from '@/interfaces/interfaces';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Home = () => {
	const [conversations, setConversations] = useState<Conversation[] | null>(null);
	const { loading, getConversations } = useGetConversations();
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState<boolean>(false);

	const fetchAccounts = async () => {
		const data = await getConversations();
		setConversations(data);
	}

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchAccounts();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchAccounts();
	}, []);

	if (loading || !conversations) {
		return <DefaultLoader />;
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
				<Header />

				<View className="px-4 pt-6 flex-col w-full items-center justify-center gap-1">
					<Text className="text-2xl text-light-200 text-center font-arimo-bold">
						YOUR FRIENDS
					</Text>

					<Text className='text-gray-400 font-arimo-medium'>Your vibe. Your people.</Text>
				</View>

				<View className="flex-1 px-4 z-10">
					<FlatList
						data={conversations}
						keyExtractor={(item) => item._id.toString()}
						contentContainerStyle={{
							marginTop: 30,
							paddingBottom: Math.max(insets.bottom, 100)
						}}
						ItemSeparatorComponent={() => <View className="h-4" />}
						ListEmptyComponent={
							<Text className="text-gray-400 text-center">No accounts found.</Text>
						}
						renderItem={({ item }) => <ConversationCard conversation={item} />}
						showsVerticalScrollIndicator={false}
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				</View>
			</LinearGradient>
		</SafeAreaView>
	)
}

export default Home;