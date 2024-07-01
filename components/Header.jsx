import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../hooks/useAuth";

export default function Header({ user, setList, setModal, setIdx, idx }) {
    const { isAdmin, isCreator } = useAuth();

    const { image, prefered_job, state, last_name, first_name } = user;
    const handleNot = async () => {
        // await AsyncStorage.clear();
        setIdx("nt");

        const ntres = await AsyncStorage.getItem("gbnot");

        const nts = JSON.parse(ntres) || [];

        if (nts?.length) {
            setList(nts);
            setModal(true);
        } else {
            Toast.show("No notifications");
        }
    };
    const handleBok = async () => {
        // await AsyncStorage.clear();
        setIdx("bk");
        const bkres = await AsyncStorage.getItem("gbbk");
        const bks = JSON.parse(bkres) || [];
        if (bks?.length) {
            setList(bks);
            setModal(true);
        } else {
            Toast.show("No Bookmarks");
        }
    };

    return (
        <View
            className="flex-row items-center space-x-2 rounded-t-full
        px-3"
        >
            <View
                className="rounded-full  w-10 h-10 bg-card items-center
            justify-center"
            >
                <Image
                    className="w-8 h-8 rounded-full"
                    style={{ resizeMode: "cover" }}
                    source={{ uri: image }}
                />
            </View>
            <View className="flex-1">
                <Text className="font-semibold text-sm capitalize text-title">{`${last_name} ${first_name}`}</Text>
                <Text className="capitalize text-body text-xs">{`${prefered_job},${state}`}</Text>
            </View>
            <View className="flex-row space-x-3 items-center">
                {(isAdmin || isCreator) && (
                    <Text
                        onPress={() => router.push("/create")}
                        className="text-primary"
                    >
                        <Ionicons name="add" size={24} />
                    </Text>
                )}
                <Text onPress={handleBok} className="text-primary">
                    <Ionicons name="bookmark-outline" size={24} />
                </Text>
                <Text onPress={handleNot} className="text-primary">
                    <Ionicons name="notifications-outline" size={24} />
                </Text>
            </View>
        </View>
    );
}
