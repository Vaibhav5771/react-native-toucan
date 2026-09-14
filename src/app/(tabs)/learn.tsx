import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "@/components/image";
import { LessonCard } from "@/components/lesson-card";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/language";
import { useProgressStore } from "@/store/progress";

type Tab = "lessons" | "practice";

export default function LearnScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("lessons");
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const completedItemIds = useProgressStore((state) => state.completedItemIds);

  const language = languages.find((item) => item.id === selectedLanguageId) ?? languages[0];
  const unit = units
    .filter((item) => item.languageId === language.id)
    .sort((a, b) => a.order - b.order)[0];
  const unitLessons = lessons
    .filter((lesson) => lesson.unitId === unit?.id)
    .sort((a, b) => a.order - b.order);

  const completedCount = unitLessons.filter((lesson) => completedItemIds.includes(lesson.id)).length;
  const currentLesson =
    unitLessons.find((lesson) => !completedItemIds.includes(lesson.id)) ?? unitLessons[unitLessons.length - 1];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-3 px-screen pt-2">
          <Pressable
            accessibilityLabel="Go back"
            onPress={() => router.canGoBack() && router.back()}
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-pill active:bg-surface"
          >
            <Ionicons name="chevron-back" size={24} color="#10151f" />
          </Pressable>
          <View className="flex-1">
            <Text className="font-poppins-semibold text-h3 text-ink" numberOfLines={1}>
              {currentLesson?.title ?? unit?.title ?? language.name}
            </Text>
            <Text className="font-poppins text-body-sm text-ink-muted">
              Unit {unit?.order ?? 1} • {completedCount} / {unitLessons.length} lessons
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Save unit"
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-pill active:bg-surface"
          >
            <Ionicons name="bookmark-outline" size={22} color="#10151f" />
          </Pressable>
        </View>

        <Image source={images.parisCafe} contentFit="cover" className="mt-3 h-64 w-full rounded-b-card" />

        <View className="-mt-6 flex-row gap-1 self-center rounded-pill border border-border/40 bg-background p-1 shadow-md">
          <Pressable
            onPress={() => setActiveTab("lessons")}
            className={`rounded-pill px-6 py-3 ${activeTab === "lessons" ? "bg-surface" : ""}`}
          >
            <Text
              className={`font-poppins-semibold text-body-md ${
                activeTab === "lessons" ? "text-tucana-teal-deep" : "text-ink-muted"
              }`}
            >
              Lessons
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("practice")}
            className={`rounded-pill px-6 py-3 ${activeTab === "practice" ? "bg-surface" : ""}`}
          >
            <Text
              className={`font-poppins-semibold text-body-md ${
                activeTab === "practice" ? "text-tucana-teal-deep" : "text-ink-muted"
              }`}
            >
              Practice
            </Text>
          </Pressable>
        </View>

        <View className="mt-4 gap-3 px-screen">
          {activeTab === "lessons" ? (
            unitLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                status={
                  completedItemIds.includes(lesson.id)
                    ? "completed"
                    : lesson.id === currentLesson?.id
                      ? "current"
                      : "locked"
                }
                onPress={() => router.push({ pathname: "/lesson/[id]", params: { id: lesson.id } })}
              />
            ))
          ) : (
            <View className="items-center rounded-card border border-border/60 bg-surface px-5 py-8">
              <Ionicons name="barbell-outline" size={28} color="#64748b" />
              <Text className="mt-2 font-poppins-semibold text-body-lg text-ink">Practice coming soon</Text>
              <Text className="mt-1 text-center font-poppins text-body-sm text-ink-muted">
                Vocabulary review and quick drills will show up here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
