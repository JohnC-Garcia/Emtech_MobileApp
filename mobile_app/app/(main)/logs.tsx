//logs.tsx
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import LogsTab from "../../components/LogsTab";

export default function LogsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LogsTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
