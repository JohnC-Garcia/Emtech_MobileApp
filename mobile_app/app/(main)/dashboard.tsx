//dashboard.tsx
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import OverviewTab from "../../components/OverviewTab";
import LogsTab from "../../components/LogsTab";
import EventsTab from "../../components/EventsTab";
import SettingsTab from "../../components/SettingsTab";

const Tab = createMaterialTopTabNavigator();

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Smart Battery Dashboard</Text>
      </View>

      <Tab.Navigator
        id="dashboard-tabs"
        initialRouteName="Overview"
        screenOptions={{
          tabBarStyle: { backgroundColor: "#1e293b" },
          tabBarLabelStyle: { fontSize: 12 },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#cbd5e1",
          tabBarIndicatorStyle: { backgroundColor: "#fff", height: 3 }
        }}
      >
        <Tab.Screen name="Overview" component={OverviewTab} />
        <Tab.Screen name="Logs" component={LogsTab} />
        <Tab.Screen name="Events" component={EventsTab} />
        <Tab.Screen name="Settings" component={SettingsTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    backgroundColor: "#1e3a8a",
    paddingVertical: 16,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
});
