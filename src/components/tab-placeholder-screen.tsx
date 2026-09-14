import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabPlaceholderScreenProps = {
  title: string;
};

export function TabPlaceholderScreen({ title }: TabPlaceholderScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
      <View className="flex-1 items-center justify-center px-screen">
        <Text className="font-poppins-semibold text-h2 text-ink">{title}</Text>
        <Text className="mt-2 text-center font-poppins text-body-md text-ink-muted">
          Coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
