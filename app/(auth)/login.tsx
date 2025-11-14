//login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { api } from "../../utils/api";

export default function LoginScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await api.post("/users/login", form);
      if (res.data.success) router.replace("/(main)/dashboard");
      else alert(res.data.message || "Login failed");
    } catch {
      alert("Network error or invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Battery Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(val) => setForm({ ...form, email: val })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={form.password}
        onChangeText={(val) => setForm({ ...form, password: val })}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.link}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f8fafc" },
  title: { fontSize: 28, fontWeight: "800", color: "#1e3a8a", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, backgroundColor: "#fff", marginBottom: 16 },
  button: { backgroundColor: "#1e3a8a", paddingVertical: 14, borderRadius: 8, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { color: "#1e3a8a", textAlign: "center", fontWeight: "500" },
});
