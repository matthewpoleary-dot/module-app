// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textDim,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Modules', tabBarIcon: ({ color, size }) => <Ionicons name="grid" color={color} size={size} /> }} />
      {/* Remove Add tab; route still accessible via /add */}
      <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} /> }} />
      <Tabs.Screen name="deadlines" options={{ title: 'Deadlines', tabBarIcon: ({ color, size }) => <Ionicons name="alarm" color={color} size={size} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats', tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" color={color} size={size} /> }} />
      <Tabs.Screen name="weightings" options={{ title: 'Weightings', tabBarIcon: ({ color, size }) => <Ionicons name="clipboard" color={color} size={size} /> }} />
    </Tabs>
  );
}
