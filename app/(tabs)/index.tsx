import CircularProgress from "@/components/common/CircularProgress";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const App = () => {
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

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        if (
          granted["android.permission.BLUETOOTH_CONNECT"] === "granted" &&
          granted["android.permission.BLUETOOTH_SCAN"] === "granted" &&
          granted["android.permission.ACCESS_FINE_LOCATION"] === "granted"
        ) {
          console.log("All permissions granted");
        } else {
          console.log("Permissions denied");
        }
      } catch (err) {
        console.error("Failed to request permissions", err);
      }
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const renderDevice = ({ item, index }) => (
    <View style={styles.deviceContainer}>
      <Icon name={item.icon} size={35} color="white" />
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceArea}>{item.area}</Text>
    </View>
  );

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
          <Text style={styles.devicesTitle}>Controls</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <FlatList
          data={smartDevices}
          renderItem={renderDevice}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.deviceList}
        />

        <View style={styles.weekContainer}>
          <View style={styles.weekDoneItem}>
            <Text style={styles.weekDoneText}>S</Text>
          </View>
          <View style={styles.weekDoneItem}>
            <Text style={styles.weekDoneText}>M</Text>
          </View>
          <View style={styles.weekDoneItem}>
            <Text style={styles.weekDoneText}>T</Text>
          </View>
          <View style={styles.weekItem}>
            <Text style={styles.weekText}>W</Text>
          </View>
          <View style={styles.weekItem}>
            <Text style={styles.weekText}>T</Text>
          </View>
          <View style={styles.weekItem}>
            <Text style={styles.weekText}>F</Text>
          </View>
          <View style={styles.weekItem}>
            <Text style={styles.weekText}>S</Text>
          </View>
        </View>

        <View style={styles.circularProgressContainer}>
          <CircularProgress
            size={120}
            strokeWidth={12}
            progress={75}
            color="green"
          />
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
};

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

export default App;
