//overview.tsx
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import OverviewTab from "../../components/OverviewTab";

export default function OverviewScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <OverviewTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
