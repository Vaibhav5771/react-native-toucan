import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import type { ComponentProps } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/image";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";

type IconName = ComponentProps<typeof Ionicons>["name"];

const FEEDBACK = [
  { label: "Speaking", value: "Excellent", colorClass: "text-tucana-teal-deep" },
  { label: "Pronunciation", value: "Great", colorClass: "text-tucana-blue" },
  { label: "Grammar", value: "Good", colorClass: "text-warning" },
] as const;

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = lessons.find((item) => item.id === id);
  const language = languages.find((item) => item.id === lesson?.languageId);

  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(true);

  if (!lesson || !language) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
        <View className="flex-1 items-center justify-center px-screen">
          <Text className="font-poppins-semibold text-h2 text-ink">Lesson not found</Text>
          <Pressable onPress={() => router.back()} className="mt-4" hitSlop={8}>
            <Text className="font-poppins-medium text-body-md text-tucana-blue">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-3 px-screen pt-2">
          <Pressable
            accessibilityLabel="End session and go back"
            onPress={() => router.back()}
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-pill active:bg-surface"
          >
            <Ionicons name="chevron-back" size={24} color="#10151f" />
          </Pressable>
          <View className="flex-1">
            <Text className="font-poppins-semibold text-h4 text-ink">AI Teacher</Text>
            <View className="mt-0.5 flex-row items-center gap-1.5">
              <View className="h-2 w-2 rounded-pill bg-success" />
              <Text className="font-poppins-medium text-caption text-ink-muted">Online</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1 rounded-pill bg-surface px-3 py-1.5">
            <Ionicons name="headset-outline" size={14} color="#64748b" />
            <Text className="font-poppins-medium text-caption text-ink-muted">Audio only</Text>
          </View>
        </View>

        <View className="px-screen pb-1 pt-3">
          <Text className="font-poppins-medium text-body-sm text-ink-muted" numberOfLines={1}>
            {language.name} · {lesson.title}
          </Text>
          {lesson.goals[0] && (
            <Text className="mt-0.5 font-poppins text-caption text-ink-muted/70" numberOfLines={1}>
              Goal: {lesson.goals[0].text}
            </Text>
          )}
        </View>

        <View className="mx-screen mt-2 overflow-hidden rounded-card bg-ink" style={{ aspectRatio: 3 / 2 }}>
          <Image source={images.toucanOffice} contentFit="cover" className="absolute inset-0 h-full w-full" />

          <View className="absolute inset-x-3 bottom-3">
            <View className="flex-row items-start gap-3 rounded-card bg-background/95 px-4 py-3 shadow-md">
              <Text className="flex-1 font-poppins-semibold text-body-md text-ink">
                {lesson.aiTeacherPrompt.openingMessage}
              </Text>
              <Pressable
                accessibilityLabel="Play teacher audio"
                onPress={() => setIsSpeaking((value) => !value)}
                hitSlop={8}
                className="h-9 w-9 items-center justify-center rounded-pill bg-tucana-blue/10"
              >
                <Ionicons
                  name={isSpeaking ? "volume-high" : "volume-medium-outline"}
                  size={18}
                  color="#3b82f6"
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="mt-5 px-screen">
          <Text className="font-poppins-semibold text-body-md text-ink">Practice phrases</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-2"
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {lesson.phrases.map((phrase) => (
              <View
                key={phrase.id}
                className="mr-3 min-w-[170px] rounded-card border border-border/60 bg-surface px-4 py-3"
              >
                <Text className="font-poppins-semibold text-body-md text-ink">{phrase.text}</Text>
                {showSubtitles && (
                  <>
                    <Text className="mt-0.5 font-poppins text-body-sm text-ink-muted">
                      {phrase.translation}
                    </Text>
                    {phrase.pronunciation && (
                      <Text className="mt-0.5 font-poppins text-caption text-ink-muted/70">
                        {phrase.pronunciation}
                      </Text>
                    )}
                  </>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mt-6 flex-row items-center justify-center gap-10 px-screen">
          <ControlButton
            icon={isMuted ? "mic-off" : "mic"}
            label="Mic"
            active={!isMuted}
            onPress={() => setIsMuted((value) => !value)}
          />
          <ControlButton
            icon="text"
            label="Subtitles"
            active={showSubtitles}
            onPress={() => setShowSubtitles((value) => !value)}
          />
          <ControlButton
            icon="call"
            label="End Call"
            variant="danger"
            rotate={135}
            onPress={() => router.back()}
          />
        </View>

        <View className="mx-screen mb-2 mt-6 flex-row rounded-card border border-border/60 bg-surface py-4">
          {FEEDBACK.map((item, index) => (
            <View
              key={item.label}
              className={`flex-1 items-center ${index > 0 ? "border-l border-border/60" : ""}`}
            >
              <Text className="font-poppins-medium text-caption text-ink-muted">{item.label}</Text>
              <Text className={`mt-1 font-poppins-semibold text-body-md ${item.colorClass}`}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ControlButtonProps = {
  icon: IconName;
  label: string;
  active?: boolean;
  variant?: "default" | "danger";
  rotate?: number;
  onPress: () => void;
};

function ControlButton({ icon, label, active, variant = "default", rotate, onPress }: ControlButtonProps) {
  const isDanger = variant === "danger";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      className="items-center gap-2 active:opacity-80"
    >
      <View
        className={`h-14 w-14 items-center justify-center rounded-pill ${
          isDanger ? "bg-error" : active ? "bg-tucana-teal" : "bg-ink/10"
        }`}
      >
        <Ionicons
          name={icon}
          size={24}
          color={isDanger || active ? "#ffffff" : "#10151f"}
          style={rotate ? { transform: [{ rotate: `${rotate}deg` }] } : undefined}
        />
      </View>
      <Text className="font-poppins-medium text-caption text-ink-muted">{label}</Text>
    </Pressable>
  );
}
