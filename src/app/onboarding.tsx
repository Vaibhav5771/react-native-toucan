import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/image";
import { images } from "@/constants/images";

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 justify-between px-screen pb-6 pt-2">
        <View className="gap-14">
          <View className="flex-row items-center justify-center gap-3">
            <Image source={images.toucan} contentFit="contain" className="h-10 w-12" />
            <Text className="font-poppins-bold text-h2 text-ink">Tucana</Text>
          </View>

          <View className="gap-3">
            <Text className=" padding font-poppins-bold text-h1 text-ink">
              Your AI language{"\n"}
              <Text className="text-tucana-teal-deep">teacher.</Text>
            </Text>
            <Text className="text-body-lg text-ink-muted">
              Real conversations, personalized lessons, anytime, anywhere.
            </Text>
          </View>
        </View>

        <View className="relative h-72 w-72 self-center">
          <Image
            source={images.mascotWelcome}
            contentFit="contain"
            className="absolute inset-0 h-full w-full"
          />

          {/* near the ear tufts, top-left of the head */}
          <View className="absolute left-[-6%] top-[2%] rounded-card bg-tucana-blue/10 px-4 py-2">
            <Text className="font-poppins-medium text-body-md text-tucana-blue">Hello!</Text>
          </View>

          {/* near the beak tip, top-right */}
          <View className="absolute right-[-8%] top-[-6%] rounded-card bg-tucana-teal/10 px-4 py-2">
            <Text className="font-poppins-medium text-body-md text-tucana-teal-deep">¡Hola!</Text>
          </View>

          {/* near the waving hand, right side */}
          <View className="absolute left-0 top-[38%] rounded-card bg-streak/10 px-4 py-2">
            <Text className="font-poppins-medium text-body-sm text-streak">你好!</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/sign-up")}
          className="flex-row items-center justify-center gap-2 rounded-pill bg-tucana-teal py-4 active:opacity-80"
        >
          <Text className="font-poppins-semibold text-body-lg text-background">Get Started</Text>
          <Text className="font-poppins-semibold text-body-lg text-background">›</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
