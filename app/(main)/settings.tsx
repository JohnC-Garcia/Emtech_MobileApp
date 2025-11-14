import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import SettingsTab from "../../components/SettingsTab";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SettingsTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
