import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="logs" />
      <Stack.Screen name="events" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
