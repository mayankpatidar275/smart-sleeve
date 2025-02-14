import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { BleManager, Device, Characteristic } from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";

const BluetoothManager: React.FC = () => {
  const [bleManager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [receivedData, setReceivedData] = useState<string>("data");

  useEffect(() => {
    if (Platform.OS === "android") {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]).then((result) => {
        console.log("Permissions granted: ", result);
      });
    }

    return () => {
      bleManager.destroy();
    };
  }, []);

  const scanDevices = () => {
    setDevices([]);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan error: ", error);
        return;
      }
      setDevices((prevDevices) => {
        const deviceExists = prevDevices.some((d) => d.id === device?.id);
        return device && !deviceExists ? [...prevDevices, device] : prevDevices;
      });
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
    }, 10000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      console.log("Connected to: ", connected.name);
      listenForData(connected);
    } catch (error) {
      console.log("Connection error: ", error);
    }
  };

  const listenForData = async (device: Device) => {
    const services = await device.services();
    for (const service of services) {
      const characteristics = await service.characteristics();
      for (const characteristic of characteristics) {
        if (characteristic.isNotifiable) {
          characteristic.monitor((error, char) => {
            if (error) {
              console.log("Monitoring error: ", error);
              return;
            }
            if (char?.value) {
              const data = Buffer.from(char.value, "base64").toString("utf-8");
              setReceivedData(data);
            }
          });
        }
      }
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
      setReceivedData("");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 40 }}>
      <Text
        style={{
          textAlign: "center",
          color: "white",
          fontSize: 20,
          marginBottom: 10,
        }}
      >
        Available devices
      </Text>

      {devices.length ? (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => connectToDevice(item)}
              style={{
                marginVertical: 5,
                backgroundColor: "#333",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                {item.name || "Unknown Device"}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text
          style={{
            textAlign: "center",
            justifyContent: "center",
            margin: "auto",
            color: "white",
            fontSize: 10,
          }}
        >
          Scanning devices...
        </Text>
      )}

      {connectedDevice && (
        <View>
          <TouchableOpacity
            onPress={disconnectDevice}
            style={{
              marginVertical: 5,
              backgroundColor: "rgba(0, 255, 0, 0.2)",

              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ textAlign: "center", color: "white" }}>
              {connectedDevice.name || "Unknown"}
            </Text>
            <Text style={{ textAlign: "center", color: "white" }}>
              Received Data: {receivedData}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        onPress={scanDevices}
        style={{
          marginVertical: 5,
          padding: 5,
          margin: 5,
          marginBottom: 10,
          borderRadius: 5,
          borderColor: "white",
          borderWidth: 1,
        }}
      >
        <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>
          Scan devices
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BluetoothManager;

// import React, { useEffect, useState } from "react";
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   FlatList,
// } from "react-native";
// import { Snackbar } from "react-native-paper";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { BleManager, Device } from "react-native-ble-plx";

// const manager = new BleManager();

// export default function DevicesScreen() {
//   const [devices, setDevices] = useState<Device[]>([]);
//   const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
//   const [snackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   useEffect(() => {
//     const subscription = manager.onStateChange((state) => {
//       if (state === "PoweredOn") {
//         startScanning();
//       }
//     }, true);

//     return () => {
//       subscription.remove();
//       manager.stopDeviceScan();
//     };
//   }, []);

//   const startScanning = () => {
//     setDevices([]); // Clear previous devices before scanning
//     manager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         console.log("Error scanning devices: ", error);
//         return;
//       }

//       if (device && !devices.some((d) => d.id === device.id)) {
//         setDevices((prevDevices) => [...prevDevices, device]);
//       }
//     });

//     setTimeout(() => {
//       manager.stopDeviceScan();
//     }, 10000); // Stop scanning after 10 seconds
//   };

//   const connectToDevice = async (device: Device) => {
//     try {
//       manager.stopDeviceScan();
//       const connected = await manager.connectToDevice(device.id);
//       await connected.discoverAllServicesAndCharacteristics();
//       setConnectedDevice(connected);
//       showSnackbar(`Connected to ${device.name || "Unnamed Device"}`);
//     } catch (error) {
//       console.log("Connection error:", error);
//       showSnackbar("Failed to connect");
//     }
//   };

//   const disconnectDevice = async () => {
//     if (connectedDevice) {
//       try {
//         await manager.cancelDeviceConnection(connectedDevice.id);
//         setConnectedDevice(null);
//         showSnackbar("Device disconnected");
//       } catch (error) {
//         console.log("Disconnection error:", error);
//         showSnackbar("Failed to disconnect");
//       }
//     }
//   };

//   const showSnackbar = (message: string) => {
//     setSnackbarMessage(message);
//     setSnackbarVisible(true);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>SmartSleeve</Text>
//         <TouchableOpacity style={styles.hamburger}>
//           <Icon name="menu" size={24} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Connection Status */}
//       <View
//         style={[
//           styles.connectionStatus,
//           {
//             backgroundColor: connectedDevice
//               ? "rgba(0, 255, 0, 0.2)"
//               : "rgba(255, 0, 0, 0.2)",
//           },
//         ]}
//       >
//         <Icon
//           name="lightning-bolt"
//           size={60}
//           color={
//             connectedDevice ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"
//           }
//         />
//         <View>
//           <Text style={styles.statusText}>
//             {connectedDevice ? "Connected" : "Device Disconnected"}
//           </Text>
//           <Text style={{ color: "white", fontSize: 14 }}>
//             {connectedDevice
//               ? `Connected to ${connectedDevice.name || "Unnamed Device"}`
//               : ""}
//           </Text>
//         </View>
//       </View>

//       {/* Available Devices */}
//       <View style={styles.devicesHeader}>
//         <Text style={styles.devicesTitle}>Available Devices</Text>
//         <TouchableOpacity onPress={startScanning}>
//           <Text style={styles.scanText}>Scan</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Device List */}
//       <FlatList
//         data={devices}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             key={item.id}
//             style={styles.deviceItem}
//             onPress={() => connectToDevice(item)}
//           >
//             <Text style={styles.deviceName}>
//               {item.name || "Unnamed Device"}
//             </Text>
//             <Icon name="bluetooth" size={24} color="white" />
//           </TouchableOpacity>
//         )}
//       />

//       {/* Disconnect Button */}
//       {connectedDevice && (
//         <TouchableOpacity
//           style={styles.disconnectButton}
//           onPress={disconnectDevice}
//         >
//           <Text style={styles.disconnectText}>Disconnect</Text>
//         </TouchableOpacity>
//       )}

//       {/* Snackbar */}
//       <Snackbar
//         visible={snackbarVisible}
//         onDismiss={() => setSnackbarVisible(false)}
//         duration={3000}
//       >
//         {snackbarMessage}
//       </Snackbar>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
//   hamburger: {
//     backgroundColor: "#333",
//     padding: 10,
//     borderRadius: 25,
//   },
//   connectionStatus: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     margin: 16,
//     borderRadius: 10,
//   },
//   statusText: {
//     color: "white",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   devicesHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     marginTop: 10,
//   },
//   devicesTitle: {
//     color: "white",
//     fontSize: 18,
//   },
//   scanText: {
//     color: "#00A8FF",
//     fontSize: 16,
//   },
//   deviceItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//     backgroundColor: "#1E1E1E",
//     borderRadius: 8,
//     marginBottom: 8,
//     marginHorizontal: 16,
//   },
//   deviceName: {
//     color: "white",
//     fontSize: 18,
//   },
//   disconnectButton: {
//     backgroundColor: "red",
//     padding: 14,
//     borderRadius: 10,
//     margin: 16,
//     alignItems: "center",
//   },
//   disconnectText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
