// mockDataUploader.js 
// Purpose: Upload calibrated battery data while computing SoC using OCV, Coulomb Counting, and Kalman Filter algorithms.
//           Evaluate all three based on constraints: Accuracy (Error Index), Economic (File Size), Performance (Execution Time),
//           Safety (RAM Usage), Efficiency (Power Consumption).
// Dataset:  D:\Project Design\Codes\backend\Batt_IV_Data_100Ah_071116_FINAL_VM_ACM.csv

import fs from "fs";
import csv from "csv-parser";
import axios from "axios";

const FILE_PATH = "C:/CJ Files/Project Design/Codes/backend/Batt_IV_Data_100Ah_071116_FINAL_VM_ACM.csv";

// RAW DATA ENDPOINT IN YOUR BACKEND
const API_URL = "http://localhost:5000/api/sensors/raw";

// ---------- PARSER FOR TIME FIELD ----------
function parseTimestamp(timeStr) {
  const now = new Date();
  const [h, m, s] = timeStr.split(":").map(Number);

  now.setHours(h);
  now.setMinutes(m);
  now.setSeconds(s);
  now.setMilliseconds(0);

  return now;
}

// ---------- MAIN UPLOADER ----------
async function uploadRawData() {
  let rows = [];
  fs.createReadStream(FILE_PATH)
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", async () => {
      console.log(`Loaded ${rows.length} rows. Uploading to raw_readings…`);

      let toggle = true;

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];

        const voltage = parseFloat(r["Voltage (Calibrated)"]) || 0;
        const currentA = parseFloat(r["Current (Calibrated)"]) || 0;
        const current_mA = currentA * 1000;
        const power_mW = voltage * currentA * 1000;

        const timestamp = parseTimestamp(r["Time"]);
        const batteryId = toggle ? "A" : "B";
        toggle = !toggle;

        const payload = {
          timestamp,
          voltage_V: voltage,
          current_mA,
          power_mW,
          batteryId
        };

        try {
          await axios.post(API_URL, payload);
          console.log(`Uploaded ${i + 1}/${rows.length}`, payload);
        } catch (err) {
          console.error("Upload failed:", err.message);
        }
      }

      console.log("Upload to raw_readings complete.");
    });
}

uploadRawData();
