//signup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { api } from "../../utils/api";

export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSignup = async () => {
    try {
      const res = await api.post("/users/register", form);
      if (res.status === 201) {
        alert("Account created successfully!");
        router.push("/(auth)/login");
      } else alert(res.data.message || "Signup failed");
    } catch {
      alert("Network or server error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Name" onChangeText={(val) => setForm({ ...form, name: val })} />
      <TextInput style={styles.input} placeholder="Email" onChangeText={(val) => setForm({ ...form, email: val })} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={(val) => setForm({ ...form, password: val })} />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
