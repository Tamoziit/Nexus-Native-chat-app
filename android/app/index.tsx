import { Image, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import Platform from "@/components/Platform";

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
          contentContainerStyle={{
            minHeight: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View className="items-center justify-center">
            <Image
              source={images.Logo}
              className="w-60 h-60"
              resizeMode="cover"
            />

            <Platform />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
