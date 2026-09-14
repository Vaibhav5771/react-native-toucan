import { FontAwesome } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

type SocialAuthButtonProps = {
  icon: keyof typeof FontAwesome.glyphMap;
  iconColor: string;
  label: string;
  onPress?: () => void;
};

export function SocialAuthButton({ icon, iconColor, label, onPress }: SocialAuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-center gap-3 rounded-input border border-border py-3.5 active:opacity-70"
    >
      <FontAwesome name={icon} size={20} color={iconColor} />
      <Text className="font-poppins-medium text-body-md text-ink">{label}</Text>
    </Pressable>
  );
}
