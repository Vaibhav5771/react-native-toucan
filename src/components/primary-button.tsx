import type { PressableProps } from "react-native";
import { Pressable, Text } from "react-native";

type PrimaryButtonProps = Omit<PressableProps, "children" | "className"> & {
  label: string;
  showArrow?: boolean;
  className?: string;
};

export function PrimaryButton({ label, showArrow = false, className = "", ...props }: PrimaryButtonProps) {
  return (
    <Pressable
      {...props}
      className={`flex-row items-center justify-center gap-2 rounded-pill bg-tucana-teal py-4 active:opacity-80 disabled:opacity-60 ${className}`}
    >
      <Text className="font-poppins-semibold text-body-lg text-background">{label}</Text>
      {showArrow && <Text className="font-poppins-semibold text-body-lg text-background">›</Text>}
    </Pressable>
  );
}
