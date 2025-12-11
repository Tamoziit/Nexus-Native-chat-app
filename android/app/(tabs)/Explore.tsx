import DefaultLoader from '@/components/DefaultLoader';
import AccountCard from '@/components/explore/AccountCard';
import Header from '@/components/Header';
import useExploreAccounts from '@/hooks/useExploreAccounts';
import { Account } from '@/interfaces/interfaces';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Explore = () => {
	const [accounts, setAccounts] = useState<Account[] | null>(null);
	const { loading, getAccounts } = useExploreAccounts();
	const insets = useSafeAreaInsets();

	const fetchAccounts = async () => {
		const data = await getAccounts();
		setAccounts(data);
	}

	useEffect(() => {
		fetchAccounts();
	}, []);

	if (loading || !accounts) {
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
						EXPLORE FRIENDS
					</Text>

					<Text className='text-gray-400 font-arimo-medium'>Explore. Connect. Vibe.</Text>
				</View>

				<View className="flex-1 px-4 z-10">
					<FlatList
						data={accounts}
						keyExtractor={(item) => item._id.toString()}
						contentContainerStyle={{
							marginTop: 30,
							paddingBottom: Math.max(insets.bottom, 100)
						}}
						ItemSeparatorComponent={() => <View className="h-4" />}
						ListEmptyComponent={
							<Text className="text-gray-400 text-center">No accounts found.</Text>
						}
						renderItem={({ item }) => <AccountCard account={item} />}
						showsVerticalScrollIndicator={false}
					/>
				</View>
			</LinearGradient>
		</SafeAreaView>
	)
}

export default Explore;