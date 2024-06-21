import * as Notifications from "expo-notifications";
export const sendPushNotification = async (message) => {
    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    });
};

export const schedulePushNotification = async (message, trigger) => {
    await Notifications.scheduleNotificationAsync({
        content: message,
        trigger
    });
};
