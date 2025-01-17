import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button, Snackbar } from "react-native-paper";
import axios from "axios";
import CircularProgress from "@/components/common/CircularProgress";

const Control = () => {
  const [apiConnectionStatus, setApiConnectionStatus] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [smartDevices, setSmartDevices] = useState([
    {
      icon: "water",
      name: "Set water limit",
      area: "for today",
      power: false,
    },
    {
      icon: "lightbulb",
      name: "Remaining water",
      area: "consumption",
      power: false,
    },
    { icon: "water", name: "Drink", area: "achieve your target", power: false },
    { icon: "snowflake", name: "10 Days", area: "streak", power: false },
  ]);

  const connectServer = async () => {
    try {
      setSnackbarMessage("Connecting to server...");
      setSnackbarVisible(true);

      const response = await axios.get(
        "https://your-server-url.Ngrok-free.app"
      );
      if (response.status === 200) {
        setSnackbarMessage("Server Connected");
        setApiConnectionStatus(true);
      }
    } catch (error) {
      setSnackbarMessage("Failed to connect to server");
    } finally {
      setTimeout(() => setSnackbarVisible(false), 3000);
    }
  };

  const renderDevice = ({ item, index }) => (
    <View style={styles.deviceContainer}>
      <Icon name={item.icon} size={35} color="white" />
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceArea}>{item.area}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
              backgroundColor: apiConnectionStatus
                ? "rgba(0, 255, 0, 0.2)"
                : "rgba(255, 0, 0, 0.2)",
            },
          ]}
        >
          <Icon
            name="lightning-bolt"
            size={60}
            color={
              apiConnectionStatus
                ? "rgba(0, 255, 0, 0.8)"
                : "rgba(255, 0, 0, 0.8)"
            }
          />
          <View>
            <Text
              style={{
                color: apiConnectionStatus
                  ? "rgba(0, 255, 0, 0.8)"
                  : "rgba(255, 0, 0, 0.8)",
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              {apiConnectionStatus ? "300 ml" : "--.-- ml"}
            </Text>
            <Text style={{ color: "white", fontSize: 14 }}>
              {apiConnectionStatus
                ? "Current Water Level"
                : "Device Disconnected"}
            </Text>
          </View>
        </View>

        {/* Linked Devices */}
        <View style={styles.linkedDevicesHeader}>
          <Text style={styles.devicesTitle}>Linked Devices</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <FlatList
          data={smartDevices}
          renderItem={renderDevice}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.deviceList}
        />

        <div style={styles.weekContainer}>
          <div style={styles.weekDoneItem}>S</div>
          <div style={styles.weekDoneItem}>M</div>
          <div style={styles.weekDoneItem}>T</div>
          <div style={styles.weekItem}>W</div>
          <div style={styles.weekItem}>T</div>
          <div style={styles.weekItem}>F</div>
          <div style={styles.weekItem}>S</div>
        </div>

        <div style={styles.circularProgressContainer}>
          <CircularProgress
            size={120}
            strokeWidth={12}
            progress={75}
            color="green"
          />
        </div>
      </ScrollView>

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
};

const styles = StyleSheet.create({
  circularProgressContainer: {
    display: "flex",
    justifyContent: "center",
    margin: 16,
  },
  weekContainer: {
    backgroundColor: "#212121",
    padding: 18,
    margin: 16,
    display: "flex",
    justifyContent: "space-around",
    borderRadius: 10,
  },
  weekDoneItem: {
    textAlign: "center",
    borderRadius: "100%",
    backgroundColor: "green",
    color: "white",
    padding: 8,
    height: 15,
    width: 15,
    // fontFamily: "",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  weekItem: {
    textAlign: "center",
    borderRadius: "100%",
    backgroundColor: "white",

    padding: 8,
    height: 15,
    width: 15,
    // fontFamily: "",
    fontFamily: "Arial, Helvetica, sans-serif",
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

export default Control;
