import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
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

export function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const indicatorX = useSharedValue(0);
  const activeIndex = state.index;

  useEffect(() => {
    if (!barWidth) {
      return;
    }

    const nextX = activeIndex * (barWidth / TAB_ITEMS.length);
    indicatorX.set(
      withSpring(nextX, {
        duration: 280,
        dampingRatio: 0.9,
        reduceMotion: ReduceMotion.System,
      }),
    );
  }, [activeIndex, barWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.get() }],
  }));

  return (
    <View
      className="bg-background px-screen pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 20) }}
    >
      <View
        className="relative flex-row rounded-pill border border-border bg-background p-1 shadow-sm"
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width - 8)}
      >
        <Animated.View
          pointerEvents="none"
          className="absolute bottom-1 left-1 top-1 rounded-pill bg-tucana-teal/10"
          style={[{ width: barWidth / TAB_ITEMS.length }, indicatorStyle]}
        />

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
              className="h-[60px] flex-1 items-center justify-center gap-0.5"
              hitSlop={6}
            >
              <Ionicons
                name={isFocused ? item.activeIcon : item.icon}
                size={21}
                className={isFocused ? "text-tucana-teal" : "text-ink-muted"}
              />
              <Text
                className={`font-poppins-medium text-caption ${isFocused ? "text-tucana-teal" : "text-ink-muted"}`}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
