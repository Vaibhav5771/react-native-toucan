import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type AuthTextInputProps = TextInputProps & {
  label: string;
  error?: string;
};

export const AuthTextInput = forwardRef<TextInput, AuthTextInputProps>(function AuthTextInput(
  { label, error, secureTextEntry, onFocus, onBlur, ...inputProps },
  ref,
) {
  const [isValueVisible, setIsValueVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  let borderClassName = "border-transparent";
  if (error) {
    borderClassName = "border-error";
  } else if (isFocused) {
    borderClassName = "border-tucana-teal-deep";
  }

  return (
    <View className="gap-1.5">
      <Text className="text-caption text-ink-muted">{label}</Text>
      <View
        className={`flex-row items-center rounded-input border bg-surface px-4 py-3.5 ${borderClassName}`}
      >
        <TextInput
          ref={ref}
          className="flex-1 font-poppins-regular text-body-lg text-ink"
          placeholderTextColor="#94a3b8"
          secureTextEntry={secureTextEntry && !isValueVisible}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setIsValueVisible((prev) => !prev)}
            className="-mr-2 h-11 w-11 items-center justify-center active:opacity-60"
          >
            <Ionicons
              name={isValueVisible ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#64748b"
            />
          </Pressable>
        )}
      </View>
      {error && <Text className="text-caption text-error">{error}</Text>}
    </View>
  );
});
