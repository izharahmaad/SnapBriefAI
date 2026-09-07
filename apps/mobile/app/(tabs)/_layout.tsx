import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 78,
          paddingTop: 10,
          paddingBottom: 16,
          backgroundColor: '#111315',
          borderTopColor: '#23272A',
        },
        tabBarActiveTintColor: '#D8FF5A',
        tabBarInactiveTintColor: '#6E7478',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarIcon: ({ color, focused }) => {
          const name = route.name === 'home'
            ? focused ? 'sparkles' : 'sparkles-outline'
            : route.name === 'history'
            ? focused ? 'time' : 'time-outline'
            : focused ? 'settings' : 'settings-outline';
          return <Ionicons name={name as any} size={21} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Create' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
