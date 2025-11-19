import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";

interface LogEntry {
  timestamp: string;
  batteryName?: string;
  voltage_V?: number;
  current_A?: number;
  soh_pct?: number;
  soc_kf?: number;
  soc_ocv?: number;
  soc_cc?: number;
}

const safe = (v: any) =>
  typeof v === "number" && isFinite(v) ? v : 0;

export default function LogsTab() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [batteryFilter, setBatteryFilter] = useState("All");
  const [range, setRange] = useState("today");
  const [orderBy, setOrderBy] = useState<keyof LogEntry>("timestamp");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const url =
          range === "today"
            ? "http://192.168.254.126:5000/api/processed-readings?range=today"
            : "http://192.168.254.126:5000/api/processed-readings";

        const res = await axios.get(url);
        if (Array.isArray(res.data)) setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const id = setInterval(fetchLogs, 10000);
    return () => clearInterval(id);
  }, [range]);

  const batteryList = useMemo(
    () =>
      Array.from(
        new Set(logs.map((r) => r.batteryName).filter((x): x is string => !!x))
      ),
    [logs]
  );

  const filteredData =
    batteryFilter === "All"
      ? logs
      : logs.filter((r) => r.batteryName === batteryFilter);

  const handleSort = (key: keyof LogEntry) => {
    const isAsc = orderBy === key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(key);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[orderBy];
    const valB = b[orderBy];

    if (orderBy === "timestamp") {
      const tA = new Date(valA as string).getTime();
      const tB = new Date(valB as string).getTime();
      return order === "asc" ? tA - tB : tB - tA;
    }

    const aNum = safe(valA);
    const bNum = safe(valB);

    return order === "asc" ? aNum - bNum : bNum - aNum;
  });

  const paginatedData = sortedData.slice(0, page * rowsPerPage);

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {[
        { key: "timestamp", label: "Timestamp" },
        { key: "batteryName", label: "Battery" },
        { key: "voltage_V", label: "Voltage" },
        { key: "current_A", label: "Current" },
        { key: "soh_pct", label: "SoH" },
      ].map((col) => (
        <TouchableOpacity
          key={col.key}
          style={styles.headerCell}
          onPress={() => handleSort(col.key as keyof LogEntry)}
        >
          <Text style={styles.headerText}>
            {col.label}
            {orderBy === col.key ? (order === "asc" ? " ↑" : " ↓") : ""}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItem = ({ item }: { item: LogEntry }) => {
    const t = new Date(item.timestamp);
    const ts = isFinite(t.getTime())
      ? t.toLocaleTimeString()
      : "--:--";

    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{ts}</Text>
        <Text style={styles.cell}>{item.batteryName || "—"}</Text>
        <Text style={styles.cell}>{safe(item.voltage_V).toFixed(2)} V</Text>
        <Text style={styles.cell}>{safe(item.current_A).toFixed(2)} A</Text>
        <Text style={styles.cell}>{safe(item.soh_pct).toFixed(1)}%</Text>
      </View>
    );
  };

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <TouchableOpacity
            style={[styles.filterButton, range === "today" && styles.filterActive]}
            onPress={() => setRange("today")}
          >
            <Text style={[styles.filterText, range === "today" && styles.filterTextActive]}>
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, range === "all" && styles.filterActive]}
            onPress={() => setRange("all")}
          >
            <Text style={[styles.filterText, range === "all" && styles.filterTextActive]}>
              All Data
            </Text>
          </TouchableOpacity>

          {batteryList.map((batt) => (
            <TouchableOpacity
              key={batt}
              style={[
                styles.filterButton,
                batteryFilter === batt && styles.filterActive,
              ]}
              onPress={() => setBatteryFilter(batt)}
            >
              <Text
                style={[
                  styles.filterText,
                  batteryFilter === batt && styles.filterTextActive,
                ]}
              >
                {batt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {renderHeader()}

      <FlatList
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.timestamp}
        onEndReached={() =>
          setPage((prev) =>
            paginatedData.length < sortedData.length ? prev + 1 : prev
          )
        }
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 10 },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1e3a8a",
    backgroundColor: "#fff",
  },
  filterActive: {
    backgroundColor: "#1e3a8a",
  },
  filterText: { color: "#1e3a8a", fontWeight: "500" },
  filterTextActive: { color: "#fff" },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#1e3a8a",
    borderRadius: 6,
    marginBottom: 4,
  },
  headerCell: {
    flex: 1,
    padding: 8,
    alignItems: "center",
  },
  headerText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 6,
    marginVertical: 2,
    elevation: 1,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#111827",
    fontSize: 14,
  },
});
