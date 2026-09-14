import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/image";
import { PrimaryButton } from "@/components/primary-button";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import type { LanguageId } from "@/types/learning";

export default function LanguageSelectionScreen() {
  const [selectedLanguageId, setSelectedLanguageId] = useState<LanguageId>("spanish");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-screen pb-0">
          <View className="relative h-16 items-center justify-center">
            <Pressable
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              className="absolute left-0 h-11 w-11 items-start justify-center active:opacity-60"
            >
              <Ionicons name="chevron-back" size={28} color="#10151f" />
            </Pressable>
            <Text className="font-poppins-semibold text-h3 text-ink">Choose a language</Text>
          </View>

          <View className="mt-5 flex-row items-center gap-3 rounded-pill border border-border bg-surface px-5 py-2">
            <Ionicons name="search-outline" size={24} color="#64748b" />
            <TextInput
              accessibilityLabel="Search languages"
              placeholder="Search languages"
              placeholderTextColor="#64748b"
              className="flex-1 font-poppins text-body-lg text-ink"
            />
          </View>

          <Text className="mt-9 font-poppins-semibold text-h3 text-ink">Popular</Text>

          <View className="mt-4 gap-3">
            {languages.map((language) => {
              const isSelected = language.id === selectedLanguageId;

              return (
                <Pressable
                  key={language.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedLanguageId(language.id)}
                  className={`min-h-24 flex-row items-center gap-4 rounded-card border px-4 py-3 active:opacity-80 ${
                    isSelected ? "border-tucana-teal bg-tucana-teal/5" : "border-border bg-background"
                  }`}
                >
                  <Image source={{ uri: language.flag }} contentFit="cover" className="h-12 w-12 rounded-pill" />
                  <View className="flex-1 gap-0.5">
                    <Text className="font-poppins-semibold text-h3 text-ink">{language.name}</Text>
                    <Text className="font-poppins text-body-md text-ink-muted">{language.nativeName}</Text>
                    <Text className="font-poppins text-caption text-ink-muted" numberOfLines={1}>
                      {language.description}
                    </Text>
                  </View>
                  <Ionicons
                    name={isSelected ? "checkmark-circle" : "chevron-forward"}
                    size={30}
                    color={isSelected ? "#14b8a6" : "#64748b"}
                  />
                </Pressable>
              );
            })}
          </View>

          <PrimaryButton
            accessibilityLabel="Confirm selected language"
            onPress={() => router.replace("/")}
            label="Continue"
            className="mt-6"
          />

          <View className="mt-auto h-52 overflow-hidden">
            <Image
              source={images.earth}
              contentFit="cover"
              contentPosition={{ top: 0, left: "50%" }}
              className="h-full w-full"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
