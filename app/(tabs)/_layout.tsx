// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors } from "../../constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563EB", // blue-600
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 58,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="Calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="Deadlines"
        options={{
          title: "Deadlines",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="weightings"
        options={{
          title: "Weightings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="podium-outline" color={color} size={size} />
          ),
        }}
      />

      {/**
       * 🚫 No "add" tab here.
       * If app/(tabs)/add.tsx still exists in this folder, move it out so it doesn't appear as a tab:
       *   git mv app/(tabs)/add.tsx app/add.tsx
       * You can continue to navigate with <Link href="/add" /> or router.push("/add").
       */}
    </Tabs>
  );
}
