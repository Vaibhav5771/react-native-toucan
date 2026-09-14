import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/image";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/language";
import { useProgressStore } from "@/store/progress";

export default function HomeScreen() {
  const { user } = useUser();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const streak = useProgressStore((state) => state.streak);
  const completedItemIds = useProgressStore((state) => state.completedItemIds);
  const toggleItemComplete = useProgressStore((state) => state.toggleItemComplete);

  const language = languages.find((item) => item.id === selectedLanguageId) ?? languages[0];
  const currentUnit = units
    .filter((unit) => unit.languageId === language.id)
    .sort((a, b) => a.order - b.order)[0];
  const currentLesson = lessons.find((lesson) => lesson.unitId === currentUnit?.id);

  const planItems = [
    {
      id: "lesson",
      icon: "book" as const,
      color: "bg-tucana-teal",
      title: "Lesson",
      subtitle: currentLesson?.title ?? "New lesson",
      xp: 10,
    },
    {
      id: "ai-conversation",
      icon: "headset" as const,
      color: "bg-tucana-blue",
      title: "AI Conversation",
      subtitle: currentLesson?.aiTeacherPrompt.suggestedTopics[0] ?? "Practice speaking",
      xp: 5,
    },
    {
      id: "new-words",
      icon: "chatbubbles" as const,
      color: "bg-tucana-teal-deep",
      title: "New words",
      subtitle: `${currentLesson?.vocabulary.length ?? 0} words`,
      xp: 5,
    },
  ];

  const dailyGoalXp = planItems.reduce((sum, item) => sum + item.xp, 0);
  const earnedXp = planItems
    .filter((item) => completedItemIds.includes(item.id))
    .reduce((sum, item) => sum + item.xp, 0);
  const progressRatio = Math.min(earnedXp / dailyGoalXp, 1);

  const firstName = user?.firstName ?? "there";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-screen"
      >
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-3 pr-3">
            <Image
              source={{ uri: language.flag }}
              contentFit="cover"
              className="h-9 w-9 rounded-pill"
            />
            <Text className="flex-1 font-poppins-semibold text-h3 text-ink" numberOfLines={1}>
              {language.greeting}, {firstName}!
            </Text>
          </View>
          <View className="mx-3 h-6 w-px bg-border" />
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Image source={images.streakFire} contentFit="contain" className="h-10 w-10" />
              <Text className="font-poppins-semibold text-body-lg text-streak">{streak}</Text>
            </View>
            <Pressable
              accessibilityLabel="Notifications"
              hitSlop={4}
              className="h-11 w-11 items-center justify-center rounded-pill bg-surface active:opacity-70 active:scale-[0.96]"
            >
              <Ionicons name="notifications-outline" size={20} color="#10151f" />
            </Pressable>
          </View>
        </View>

        <View className="mt-4 h-px w-full bg-border" />

        <View className="mt-4 flex-row items-center overflow-hidden rounded-card border border-border/60 bg-background px-5 py-4 shadow-sm">
          <View className="flex-1 gap-2 pr-3">
            <Text className="font-poppins-medium text-body-md text-ink-muted">Daily goal</Text>
            <Text className="font-poppins-bold text-h2 text-ink">
              {earnedXp} <Text className="text-ink-muted">/ {dailyGoalXp} XP</Text>
            </Text>
            <View className="h-2.5 w-full overflow-hidden rounded-pill bg-surface">
              <View className="h-full rounded-pill bg-streak" style={{ width: `${progressRatio * 100}%` }} />
            </View>
          </View>
          <Image source={images.treasure} contentFit="contain" className="h-20 w-20" />
        </View>

        <Pressable
          accessibilityLabel={`Continue learning ${language.name}`}
          onPress={() => router.push("/learn")}
          className="mt-4 overflow-hidden rounded-card shadow-lg active:opacity-90 active:scale-[0.99]"
        >
          <LinearGradient
            colors={["#14b8a6", "#3b82f6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: "relative", paddingHorizontal: 20, paddingVertical: 20 }}
          >
            <Image
              source={images.palace}
              contentFit="contain"
              contentPosition="right"
              className="absolute bottom-0 right-0 h-full w-52 opacity-90"
            />
            <Text className="font-poppins-medium text-body-md text-background/80">Continue learning</Text>
            <Text className="mt-1 font-poppins-bold text-h1 text-background">{language.name}</Text>
            <Text className="mt-0.5 font-poppins text-body-md text-background/80">
              Unit {currentUnit?.order ?? 1} • {currentUnit?.title ?? language.name}
            </Text>
            <View className="mt-4 self-start rounded-pill bg-background px-6 py-2.5">
              <Text className="font-poppins-semibold text-body-md text-tucana-teal-deep">Continue</Text>
            </View>
          </LinearGradient>
        </Pressable>

        <View className="mt-6 flex-row items-center justify-between">
          <Text className="font-poppins-semibold text-h3 text-ink">Today&apos;s plan</Text>
          <Pressable onPress={() => router.push("/learn")} hitSlop={8}>
            <Text className="font-poppins-medium text-body-md text-tucana-blue">View all</Text>
          </Pressable>
        </View>

        <View className="mt-3 overflow-hidden rounded-card border border-border/60 bg-background shadow-sm">
          {planItems.map((item, index) => {
            const isDone = completedItemIds.includes(item.id);

            return (
              <Pressable
                key={item.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isDone }}
                onPress={() => toggleItemComplete(item.id)}
                className={`flex-row items-center gap-3 px-4 py-3 active:bg-surface active:scale-[0.99] ${
                  index > 0 ? "border-t border-border/60" : ""
                }`}
              >
                <View className={`h-11 w-11 items-center justify-center rounded-input ${item.color}`}>
                  <Ionicons name={item.icon} size={20} color="#ffffff" />
                </View>
                <View className="flex-1">
                  <Text className="font-poppins-medium text-body-lg text-ink">{item.title}</Text>
                  <Text className="font-poppins text-body-sm text-ink-muted" numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons
                  name={isDone ? "checkmark-circle" : "ellipse-outline"}
                  size={26}
                  color={isDone ? "#14b8a6" : "#e2e8f0"}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
