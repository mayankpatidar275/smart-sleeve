import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import React, { useEffect, useState } from "react";
import { BleManager } from "react-native-ble-plx";

export default function DevicesScreen() {
  const [devices, setDevices] = useState([]);
  const [deviceConnStatus, setDeviceConnStatus] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const manager = new BleManager();

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.log("Error scanning devices: ", error);
            return;
          }

          if (device && !devices.includes(device.name)) {
            setDevices((prevDevices) => [...prevDevices, device.name]);
          }
        });
      }
    }, true);

    return () => subscription.remove();
  }, []);
  useEffect(() => {
    console.log("devices scanned are: ");
    console.log(devices);
  }, [devices]);
  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>SmartSleeve</Text>
          <TouchableOpacity style={styles.hamburger}>
            <Icon name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Connection Status */}
        <View
          style={[
            styles.connectionStatus,
            {
              backgroundColor: deviceConnStatus
                ? "rgba(0, 255, 0, 0.2)"
                : "rgba(255, 0, 0, 0.2)",
            },
          ]}
        >
          <Icon
            name="lightning-bolt"
            size={60}
            color={
              deviceConnStatus ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"
            }
          />
          <View>
            <Text
              style={{
                color: deviceConnStatus
                  ? "rgba(0, 255, 0, 0.8)"
                  : "rgba(255, 0, 0, 0.8)",
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              {deviceConnStatus ? "300 ml" : "--.-- ml"}
            </Text>
            <Text style={{ color: "white", fontSize: 14 }}>
              {deviceConnStatus ? "Current Water Level" : "Device Disconnected"}
            </Text>
          </View>
        </View>

        {/* Available Devices */}
        <View style={styles.linkedDevicesHeader}>
          <Text style={styles.devicesTitle}>Available Devices</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <View>
          {devices.map((device, index) => (
            <View key={index}>
              <View>
                <Text> {device.name}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  circularProgressContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
  },
  weekContainer: {
    backgroundColor: "#212121",
    padding: 18,
    margin: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 10,
  },
  weekDoneItem: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15, // Circle
    backgroundColor: "green",
    padding: 8,
    height: 32,
    width: 32,
  },
  weekDoneText: {
    color: "white",
    fontFamily: "Arial",
    textAlign: "center",
  },
  weekItem: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15, // Circle
    backgroundColor: "white",
    padding: 8,
    height: 32,
    width: 32,
  },
  weekText: {
    color: "black",
    fontFamily: "Arial",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  serverButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    margin: 16,
    borderRadius: 10,
  },
  linkedDevicesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  devicesTitle: {
    color: "white",
    fontSize: 18,
  },
  seeAll: {
    color: "gray",
    fontSize: 16,
  },
  deviceList: {
    padding: 10,
  },
  deviceContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: "#212121",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  deviceName: {
    color: "white",
    marginTop: 8,
  },
  deviceArea: {
    color: "grey",
    fontSize: 12,
  },
  hamburger: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 25,
  },
});
