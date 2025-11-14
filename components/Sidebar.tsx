// mobile_app/components/Sidebar.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Sidebar = ({ tab, setTab }) => (
  <View style={styles.container}>
    <Text style={styles.header}>Smart Battery</Text>

    {["Overview", "Logs", "Events", "Settings"].map((label, i) => (
      <TouchableOpacity
        key={i}
        style={[styles.tab, tab === i && styles.active]}
        onPress={() => setTab(i)}
      >
        <Text style={styles.tabText}>{label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#111", flex: 1 },
  header: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 20 },
  tab: { paddingVertical: 10 },
  active: { backgroundColor: "#333", borderRadius: 6 },
  tabText: { color: "#fff", fontSize: 16 },
});

export default Sidebar;
