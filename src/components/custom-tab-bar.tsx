import { Ionicons } from "@expo/vector-icons";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = ComponentProps<typeof Ionicons>["name"];

const TAB_ITEMS = [
  { label: "Home", icon: "home-outline", activeIcon: "home" },
  { label: "Learn", icon: "book-outline", activeIcon: "book" },
  { label: "AI Teacher", icon: "sparkles-outline", activeIcon: "sparkles" },
  { label: "Chat", icon: "chatbubble-ellipses-outline", activeIcon: "chatbubble-ellipses" },
  { label: "Profile", icon: "person-outline", activeIcon: "person" },
] as const satisfies readonly { label: string; icon: IconName; activeIcon: IconName }[];

type CustomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];

const BAR_HEIGHT = 64;
const INDICATOR_SIZE = 46;

export function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const indicatorX = useSharedValue(0);
  const indicatorScale = useSharedValue(1);
  const activeIndex = state.index;
  const segmentWidth = barWidth / TAB_ITEMS.length;

  useEffect(() => {
    if (!barWidth) {
      return;
    }

    const nextX = activeIndex * segmentWidth + segmentWidth / 2 - INDICATOR_SIZE / 2;
    indicatorX.set(
      withSpring(nextX, { duration: 350, dampingRatio: 0.8, reduceMotion: ReduceMotion.System }),
    );
    indicatorScale.set(
      withSequence(
        withSpring(0.82, { duration: 120, reduceMotion: ReduceMotion.System }),
        withSpring(1, { duration: 260, dampingRatio: 0.6, reduceMotion: ReduceMotion.System }),
      ),
    );
  }, [activeIndex, segmentWidth, barWidth, indicatorX, indicatorScale]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.get() }, { scale: indicatorScale.get() }],
  }));

  return (
    <View className="bg-background px-screen pt-2" style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
      <GlassContainer
        spacing={20}
        style={{
          position: "relative",
          flexDirection: "row",
          alignItems: "center",
          height: BAR_HEIGHT,
          borderRadius: 999,
        }}
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
      >
        <GlassView
          glassEffectStyle="regular"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.92)",
            borderWidth: 1,
            borderColor: "rgba(16,21,31,0.06)",
            shadowColor: "#10151f",
            shadowOpacity: 0.08,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          }}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: (BAR_HEIGHT - INDICATOR_SIZE) / 2,
              width: INDICATOR_SIZE,
              height: INDICATOR_SIZE,
            },
            indicatorStyle,
          ]}
        >
          <GlassView
            glassEffectStyle={{ style: "clear", animate: true, animationDuration: 0.3 }}
            tintColor="#14b8a6"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 999,
              backgroundColor: "#14b8a6",
              shadowColor: "#14b8a6",
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}
          />
        </Animated.View>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const item = TAB_ITEMS[index];
          const isFocused = activeIndex === index;

          const handlePress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? item.label}
              onPress={handlePress}
              onLongPress={() => navigation.emit({ type: "tabLongPress", target: route.key })}
              className="h-16 flex-1 items-center justify-center gap-1 active:opacity-70"
              hitSlop={6}
            >
              <Ionicons
                name={isFocused ? item.activeIcon : item.icon}
                size={isFocused ? 20 : 22}
                className={isFocused ? "text-background" : "text-ink-muted"}
              />
              {!isFocused && (
                <Text className="font-poppins-medium text-caption text-ink-muted" numberOfLines={1}>
                  {item.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </GlassContainer>
    </View>
  );
}
