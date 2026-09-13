import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SWATCHES = [
  { label: "Tucana Teal", className: "bg-tucana-teal" },
  { label: "Tucana Teal Deep", className: "bg-tucana-teal-deep" },
  { label: "Tucana Blue", className: "bg-tucana-blue" },
  { label: "Tucana Lime", className: "bg-tucana-lime" },
  { label: "Violet (accent, rare use)", className: "bg-tucana-violet" },
  { label: "Success", className: "bg-success" },
  { label: "Warning", className: "bg-warning" },
  { label: "Streak", className: "bg-streak" },
  { label: "Error", className: "bg-error" },
  { label: "Info", className: "bg-info" },
] as const;

export default function DesignSystem() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerClassName="gap-6 px-screen py-screen" className="bg-background">
        <Text className="font-poppins-bold text-h1 text-ink">Tucana</Text>

        <View className="gap-2">
          <Text className="font-poppins-semibold text-h2 text-ink">Type Scale</Text>
          <Text className="font-poppins-bold text-h1 text-ink">H1 Page Title</Text>
          <Text className="font-poppins-semibold text-h2 text-ink">H2 Section Title</Text>
          <Text className="font-poppins-semibold text-h3 text-ink">H3 Card Title</Text>
          <Text className="font-poppins-medium text-h4 text-ink">H4 Subheading</Text>
          <Text className="text-body-lg text-ink">Body Large — important content</Text>
          <Text className="text-body-md text-ink">Body Medium — body text</Text>
          <Text className="text-body-sm text-ink-muted">Body Small — supporting text</Text>
          <Text className="text-caption text-ink-muted">Caption — labels, meta text</Text>
        </View>

        <View className="gap-2">
          <Text className="font-poppins-semibold text-h2 text-ink">Colors</Text>
          <View className="flex-row flex-wrap gap-3">
            {SWATCHES.map((swatch) => (
              <View key={swatch.label} className="w-28 gap-1">
                <View className={`h-16 w-full rounded-card border border-border ${swatch.className}`} />
                <Text className="text-caption text-ink-muted">{swatch.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-3">
          <Text className="font-poppins-semibold text-h2 text-ink">Radius</Text>
          <View className="flex-row flex-wrap items-end gap-4">
            <View className="gap-1">
              <View className="h-16 w-16 rounded-card border border-border bg-surface" />
              <Text className="text-caption text-ink-muted">rounded-card</Text>
            </View>
            <View className="gap-1">
              <View className="h-12 w-40 rounded-input border border-border bg-surface" />
              <Text className="text-caption text-ink-muted">rounded-input</Text>
            </View>
            <View className="gap-1">
              <View className="h-12 w-32 items-center justify-center rounded-pill bg-tucana-teal">
                <Text className="font-poppins-semibold text-body-md text-background">Pill button</Text>
              </View>
              <Text className="text-caption text-ink-muted">rounded-pill</Text>
            </View>
          </View>
        </View>

        <View className="gap-2 rounded-card border border-border bg-surface p-4">
          <Text className="font-poppins-medium text-h4 text-ink">Surface card</Text>
          <Text className="text-body-md text-ink-muted">
            Uses bg-surface with a bg-background page behind it, a border-border outline, and
            rounded-card for the corner radius.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
