import { Link } from "expo-router";
import { Text, View } from "react-native";

import { Image } from "@/components/image";
import { images } from "@/constants/images";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <Image source={images.toucan} contentFit="contain" className="h-36 w-40" />
      <Text className="font-poppins-bold text-h1 text-ink">Tucana</Text>
      <Link href="/onboarding" className="font-poppins-semibold text-body-md text-tucana-teal-deep">
        View onboarding
      </Link>
    </View>
  );
}
