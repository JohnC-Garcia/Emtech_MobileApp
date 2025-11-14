//OverviewTab.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";

interface BatteryData {
  timestamp: string;
  voltage_V?: number;
  current_A?: number;
  soc_kf?: number;
  soc_ocv?: number;
  soc_cc?: number;
  soh_pct?: number;
}

const safeNum = (v: any): number => {
  const n = typeof v === "number" ? v : Number(v);
  if (!isFinite(n) || Number.isNaN(n)) return 0;
  return n;
};

export default function OverviewTab() {
  const [data, setData] = useState<BatteryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [algorithm] = useState<"kalman" | "ocv" | "cc">("kalman");

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://192.168.254.126:5000/api/processed-readings?range=today"
        );
        if (!mounted) return;
        if (Array.isArray(res.data)) setData(res.data);
        else setData([]);
      } catch {
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Loading battery data...</Text>
      </View>
    );
  }

  const latest = data && data.length ? data[0] : null;

  const socRaw =
    algorithm === "ocv"
      ? latest?.soc_ocv
      : algorithm === "cc"
      ? latest?.soc_cc
      : latest?.soc_kf;

  const soc = safeNum(socRaw);

  const tail = data.slice(-30);
  const voltageSeries = tail.map((d) => safeNum(d.voltage_V));
  const currentSeries = tail.map((d) => safeNum(d.current_A));

  const timestamps = tail.map((d) => {
    const t = new Date(d.timestamp || "");
    if (!isFinite(t.getTime())) return "--:--";
    return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  if (!tail.length) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Battery Data Overview</Text>
        <Text style={styles.subtitle}>Live metrics and trends</Text>

        <View style={styles.statusCard}>
          <Text style={styles.batteryLabel}>State of Charge</Text>
          <Text style={styles.batteryValue}>{soc.toFixed(1)}%</Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(0, Math.min(100, soc))}%`,
                  backgroundColor:
                    soc > 60 ? "#1e3a8a" : soc > 30 ? "#64748b" : "#ef4444",
                },
              ]}
            />
          </View>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>Voltage</Text>
              <Text style={styles.statValue}>
                {safeNum(latest?.voltage_V).toFixed(2)} V
              </Text>
            </View>

            <View>
              <Text style={styles.statLabel}>Current</Text>
              <Text style={styles.statValue}>
                {safeNum(latest?.current_A).toFixed(2)} A
              </Text>
            </View>

            <View>
              <Text style={styles.statLabel}>SoH</Text>
              <Text style={styles.statValue}>
                {safeNum(latest?.soh_pct).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Voltage and Current Trends</Text>
          <Text>No data available.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Battery Data Overview</Text>
      <Text style={styles.subtitle}>Live metrics and trends</Text>

      <View style={styles.statusCard}>
        <Text style={styles.batteryLabel}>State of Charge</Text>
        <Text style={styles.batteryValue}>{soc.toFixed(1)}%</Text>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.max(0, Math.min(100, soc))}%`,
                backgroundColor:
                  soc > 60 ? "#1e3a8a" : soc > 30 ? "#64748b" : "#ef4444",
              },
            ]}
          />
        </View>

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statLabel}>Voltage</Text>
            <Text style={styles.statValue}>
              {safeNum(latest?.voltage_V).toFixed(2)} V
            </Text>
          </View>

          <View>
            <Text style={styles.statLabel}>Current</Text>
            <Text style={styles.statValue}>
              {safeNum(latest?.current_A).toFixed(2)} A
            </Text>
          </View>

          <View>
            <Text style={styles.statLabel}>SoH</Text>
            <Text style={styles.statValue}>
              {safeNum(latest?.soh_pct).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Voltage and Current Trends</Text>

        <LineChart
          data={{
            labels: timestamps.length ? timestamps : ["--"],
            datasets: [
              {
                data: voltageSeries.length ? voltageSeries : [0],
                color: () => "#2563eb",
                strokeWidth: 2,
              },
              {
                data: currentSeries.length ? currentSeries : [0],
                color: () => "#dc2626",
                strokeWidth: 2,
              },
            ],
            legend: ["Voltage (V)", "Current (A)"],
          }}
          width={Math.max(Dimensions.get("window").width - 40, 200)}
          height={260}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
            labelColor: () => "#475569",
            style: { borderRadius: 16 },
            propsForDots: { r: "3", strokeWidth: "2" },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f8fafc",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: { marginTop: 10, color: "#475569" },
  title: { fontSize: 22, fontWeight: "800", color: "#1e3a8a" },
  subtitle: { fontSize: 14, color: "#475569", marginBottom: 20 },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  batteryLabel: { fontSize: 16, color: "#64748b", textAlign: "center" },
  batteryValue: {
    fontSize: 40,
    fontWeight: "800",
    color: "#1e3a8a",
    textAlign: "center",
    marginVertical: 10,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 5 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statLabel: { fontSize: 14, color: "#64748b" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#1e3a8a" },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: 10,
    textAlign: "center",
  },
  chart: { borderRadius: 12 },
});
