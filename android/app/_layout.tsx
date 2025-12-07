import { Stack, useRouter, useSegments } from "expo-router";
import "./globals.css";
import Toast from "react-native-toast-message";
import { AuthContextProvider, useAuthContext } from "@/context/AuthContext";
import { useFonts } from "expo-font";
import {
  Arimo_400Regular,
  Arimo_500Medium,
  Arimo_600SemiBold,
  Arimo_700Bold,
} from "@expo-google-fonts/arimo";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { fonts } from "@/constants/fonts";

function RootNavigation() {
  const { authUser, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const firstSegment = segments[0] as string | undefined;

    const inAuthGroup = firstSegment === "(auth)";
    const inTabsGroup = firstSegment === "(tabs)";

    if (authUser) {
      if (inAuthGroup || firstSegment === undefined) {
        router.replace("/(tabs)/Home");
      }
    } else {
      if (inTabsGroup) {
        router.replace("/");
      }
    }
  }, [authUser, loading, segments]);

  const [loaded] = useFonts({
    "Arimo-Regular": Arimo_400Regular,
    "Arimo-Medium": Arimo_500Medium,
    "Arimo-SemiBold": Arimo_600SemiBold,
    "Arimo-Bold": Arimo_700Bold,
    "Bitcount-Regular": fonts.Bitcount_Regular,
    "Bitcount-Bold": fonts.Bitcount_Bold,
  });

  if (!loaded) return null;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#010b13]">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <RootNavigation />
      <Toast />
    </AuthContextProvider>
  );
}
