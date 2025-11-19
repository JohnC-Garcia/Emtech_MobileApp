import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import EventsTab from "../../components/EventsTab";

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EventsTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
