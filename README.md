# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## About

Concepts and steps:
1 - BLE device communication for Expo app
2 - npx expo install expo-dev-client
3 - eas setup (also create account from expo go app)
4 - install eas cli
5 - build the custom client

6 - User guide to explain how product works
7 - ask for required permissions like bluetooth

8 - Search for nearby esp32 devices, display list
9 - User select and connect to the device using its unique identifier (MAC address or UUID)
10 - Save connection status for future auto connect
11 - Use readCharacteristicForDevice or writeCharacteristicForDevice for communication.
