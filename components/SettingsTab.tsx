import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SettingsTab() {
  const [socAlgorithm, setSocAlgorithm] = useState("kalman");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.label}>Select SoC Estimation Algorithm:</Text>

      {["kalman", "ocv", "cc"].map((alg) => (
        <TouchableOpacity
          key={alg}
          style={[styles.option, socAlgorithm === alg && styles.selected]}
          onPress={() => setSocAlgorithm(alg)}
        >
          <Text
            style={[
              styles.optionText,
              socAlgorithm === alg && styles.selectedText,
            ]}
          >
            {alg.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#1e3a8a", marginBottom: 20 },
  label: { fontSize: 16, color: "#374151", marginBottom: 10 },
  option: {
    borderWidth: 1,
    borderColor: "#1e3a8a",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    alignItems: "center",
  },
  selected: { backgroundColor: "#1e3a8a" },
  optionText: { fontSize: 16, color: "#1e3a8a", fontWeight: "600" },
  selectedText: { color: "#fff" },
});
