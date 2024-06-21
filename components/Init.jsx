import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";

import { Platform } from "react-native";
import * as Device from "expo-device";

import { useSocket } from "../lib/socket";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";
import { setExpoPushToken } from "../redux/auth/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Init = () => {
    useSocket();
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: true
        })
    });
    const dispatch = useDispatch();
    const [setNotification] = useState();
    const notificationListener = useRef();
    const responseListener = useRef();
    // const [expoPushToken, setExpoPushToken] = useState();
    useEffect(() => {
        let isMounted = true;

        // fetch Expo Push Token
        registerForPushNotificationsAsync().then(token =>
            dispatch(setExpoPushToken(token))
        );
        notificationListener.current =
            Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(response => {
                redirect(response.notification);
            });

        Notifications.getLastNotificationResponseAsync().then(response => {
            if (!isMounted || !response?.notification) {
                return;
            }
            redirect(response?.notification);
        });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(
                    responseListener.current
                );
            }
            isMounted = false;
        };
    }, [dispatch, setNotification]);
    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C"
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } =
                    await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                alert("Failed to get push token for push notification!");
                return;
            }
            // Learn more about projectId:
            // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid

            if (!Constants.expoConfig?.extra?.eas.projectId) {
                alert("No ProjectId found in app.json");
                return;
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId: Constants.expoConfig.extra.eas.projectId
                })
            ).data;
        } else {
            alert("Must use physical device for Push Notifications");
        }

        return token;
    }
    async function redirect(notification) {
        const data = notification.request.content.data;
        const url = data?.url;
        const not = await AsyncStorage.getItem("gbnot");

        const parsed = JSON.parse(not) || [];
        const newNot = [...parsed, data];
        AsyncStorage.setItem("gbnot", JSON.stringify(newNot));

        if (url) {
            router.push(url);
        }
    }
    return null
};

export default Init;
