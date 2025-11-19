import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";

interface Event {
  timestamp: string;
  message: string;
  level: string;
}

export default function EventsTab() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://192.168.254.126:5000/api/events");
        setEvents(res.data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }: { item: Event }) => {
    const t = new Date(item.timestamp);
    const ts = isFinite(t.getTime()) ? t.toLocaleString() : "—";

    return (
      <View style={styles.eventBox}>
        <Text style={styles.level}>{item.level.toUpperCase()}</Text>
        <Text style={styles.msg}>{item.message}</Text>
        <Text style={styles.time}>{ts}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#1e3a8a" />
      ) : (
        <>
          <Text style={styles.title}>Event Logs</Text>
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={(item) => item.timestamp}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#1e3a8a", marginBottom: 20 },
  eventBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#1e3a8a",
  },
  level: { fontWeight: "700", color: "#1e3a8a" },
  msg: { color: "#111827", marginVertical: 4 },
  time: { fontSize: 12, color: "#6b7280" },
});
