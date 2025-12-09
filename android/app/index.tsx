import { Image, ScrollView, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import Platform from "@/components/Platform";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Typewriter from "@/components/landing/Typewriter";
import LandingPageAnimation from "@/components/landing/LandingPageAnimation";
import Footer from "@/components/Footer";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Index() {
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
          className="flex-1"
          showsVerticalScrollIndicator={false}
          pagingEnabled={false}
          decelerationRate="fast"
          snapToInterval={SCREEN_HEIGHT}
          snapToAlignment="start"
        >
          <View style={{ height: SCREEN_HEIGHT }} className="relative">
            <View className="absolute top-0 left-0 flex flex-row items-center justify-between py-3 px-5 w-full z-10">
              <Text className="text-4xl font-bitcount text-accent-500">NEXUS</Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/Login")}
                className="p-2"
              >
                <MaterialCommunityIcons name="login" size={28} color="#16a34a" />
              </TouchableOpacity>
            </View>

            <View className="flex-1 items-center justify-center gap-6">
              <Image
                source={images.Logo}
                className="w-60 h-60"
                resizeMode="cover"
              />
              <Platform />
              <Typewriter />

              <View className="mt-4 mb-10">
                <TouchableOpacity
                onPress={() => router.push("/(auth)/Signup")}
                  className="btn-primary py-3 px-12"
                >
                  <Text className="text-light-100 font-arimo-bold text-lg">Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="absolute bottom-28 w-full items-center">
              <MaterialCommunityIcons
                name="chevron-down"
                size={40}
                color="#16a34a"
                style={{ opacity: 0.6 }}
              />
              <Text className="text-accent-500 font-arimo text-sm opacity-60">
                Explore
              </Text>
            </View>
          </View>

          <View style={{ height: SCREEN_HEIGHT - 100 }} className="relative px-5 py-4">
            <View className="items-center bg-black/30 rounded-xl py-6">
              <LandingPageAnimation />
            </View>
          </View>

          <Footer />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}