import { Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Video, ResizeMode } from 'expo-av';
import { useEffect, useState } from 'react';
import { videoObjects } from '@/constants/landingUI';

const LandingPageAnimation = () => {
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentVideoIndex((prev) => (prev + 1) % videoObjects.length);
		}, 9000);

		return () => clearInterval(interval);
	}, []);

	return (
		<Animated.View
			key={currentVideoIndex}
			entering={FadeIn.duration(500)}
			exiting={FadeOut.duration(500)}
			className="w-full flex-col items-center gap-6"
		>
			<Text className="text-accent-500 font-bitcount text-5xl">
				{videoObjects[currentVideoIndex].title}
			</Text>
			<Video
				source={videoObjects[currentVideoIndex].file}
				style={{ width: '90%', height: 400, borderRadius: 15, borderWidth: 1, borderColor: "#16a34a" }}
				resizeMode={ResizeMode.COVER}
				shouldPlay
				isLooping
				isMuted
			/>
		</Animated.View>
	)
}

export default LandingPageAnimation;