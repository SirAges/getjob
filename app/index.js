import { useSelector, useDispatch } from "react-redux";
import * as Progress from "react-native-progress";
import {
    selectCurrentToken,
    setAsyncPersist,
    selectPersist
} from "../redux/auth/authSlice";
import { useRefreshMutation } from "../redux/auth/authApiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
export default function HomeIndex() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);
    const persist = useSelector(selectPersist);
    const [refresh] = useRefreshMutation();
    useEffect(() => {
        const getPersist = async () => {
            const persisted = await AsyncStorage.getItem("persist");
            const res = JSON.parse(persisted);

            dispatch(setAsyncPersist(res === (true || false) && res));
        };

        getPersist();
    }, [dispatch]);

    const verifyRefreshToken = async () => {
        try {
            setLoading(true);
            const data = await refresh();
            return data;
        } catch (err) {
            Alert.alert(
                "Error Message",
                "An error occured try again\n" + err.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = async () => {
        if (!persist) {
            router.replace("auth");
        }
        if (token) {
            router.replace("(tabs)");
        }
        if (persist && !token) {
            const data = await verifyRefreshToken();

            if (!data.error) {
                router.replace("(tabs)");
            } else {
                router.replace("auth");
            }
        }
    };
    return (
        <SafeAreaView className="bg-background flex-1">
            {loading && (
                <View className=" w-full items-center">
                    <Progress.Circle
                        size={30}
                        indeterminate={true}
                        borderWidth={2}
                        showsText={true}
                        useNativeDriver={true}
                    />
                </View>
            )}
            <View className="relative w-full flex-1 justify-center items-center">
                <Image
                    className="w-full h-52"
                    style={{ resizeMode: "contain" }}
                    source={require("../assets/images/find.jpg")}
                />
                <Text
                    onPress={handleNavigate}
                    className="bg-primary w-fit rounded-full py-4 px-4 text-white
            font-semibold capitalize text-center text-md "
                >
                    Find your dream job
                </Text>
            </View>
        </SafeAreaView>
    );
}
