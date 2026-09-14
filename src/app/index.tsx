import { useAuth } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Image } from "@/components/image";
import { images } from "@/constants/images";

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <Image source={images.toucan} contentFit="contain" className="h-36 w-40" />
      <Text className="font-poppins-bold text-h1 text-ink">Tucana</Text>
      <Link href="/onboarding" className="font-poppins-semibold text-body-md text-tucana-teal-deep">
        View onboarding
      </Link>
      <Link href="/language-selection" className="font-poppins-semibold text-body-md text-tucana-teal-deep">
        Choose a language
      </Link>
      <Pressable
        onPress={() => signOut()}
        className="rounded-pill border border-tucana-teal-deep px-6 py-3 active:opacity-70"
      >
        <Text className="font-poppins-semibold text-body-md text-tucana-teal-deep">Sign out</Text>
      </Pressable>
    </View>
  );
}
