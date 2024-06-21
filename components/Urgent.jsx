import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast from "react-native-simple-toast";
import {
    View,
    Text,
    FlatList,
    
    Image
} from "react-native";
import { Link } from "expo-router";
export default function Urgent({ jobs }) {
    const urgent = jobs.filter(f => {
        const date = new Date(f.job_deadline);
        const currentDate = new Date();
        const differenceInMilliseconds = currentDate - date;
        const differenceInDays =
            differenceInMilliseconds / (1000 * 60 * 60 * 24);
        return differenceInDays < 2;
    });

    

    const handleBookmark = async item => {
        // await AsyncStorage.clear();

        const res = await AsyncStorage.getItem("gbbk");
        const bks = JSON.parse(res) || [];

        const foundJob = bks.some(j => j._id === item._id);

        if (foundJob) {
            Toast.show("already added to bookmark");
            return;
        }

        const newBks = [...bks, item];
        AsyncStorage.setItem("gbbk", JSON.stringify(newBks));
        Toast.show("book marked");
    };

    return (
        <View className="px-2">
            <Text className="px-4 my-1 font-semibold w-full text-start text-md">
                Urgently Needed
            </Text>
            <FlatList
                className=""
                keyExtractor={({ _id }) => _id}
                data={urgent}
                horizontal
                renderItem={({ item: j }) => (
                    <View
                        className=" max-w-40 w-40 h-fit bg-card
                        rounded-lg mx-1 p-2"
                    >
                        <View className="flex-row items-start">
                            <View className="w-7 h-7 rounded-full p-1">
                                <Image
                                    className="rounded-full w-full h-full"
                                    style={{ resizeMode: "contain" }}
                                    source={{ uri: j.job_image }}
                                />
                            </View>
                            <View className="flex-1">
                                <Text
                                    className="font-semibold capitalize
                                    text-xs w-full text-title"
                                >
                                    {j.job_title}
                                </Text>
                                <Text
                                    className="text-xs
                                    text-body"
                                >
                                    {`\u20A6${Math.round(
                                        j.job_salary / 1000
                                    )}k/${j.job_salary_type}`}
                                </Text>
                            </View>

                            <View>
                                <Text
                                    onPress={() => handleBookmark(j)}
                                    className="text-primary"
                                >
                                    <Ionicons
                                        name={"bookmark-outline"}
                                        size={14}
                                    />
                                </Text>
                            </View>
                        </View>
                        <View className="w-full h-[1px] bg-body/10 my-1" />
                        <View
                            className="flex-row items-center
                            justify-between"
                        >
                            <View>
                                <Text
                                    className="capitalize text-sm px-1
                                    font-medium"
                                >
                                    {j.job_company}
                                </Text>
                                <View className="flex-row items-center">
                                    <Text
                                        className="text-body text-xs
                                        text-primary"
                                    >
                                        <Ionicons
                                            name="location-outline"
                                            size={14}
                                        />
                                    </Text>
                                    <Text
                                        className="text-xs font-semibold
                                        capitalize"
                                    >
                                        {j.job_state}
                                    </Text>
                                </View>
                            </View>
                            <Link
                                href={`/(tabs)/${j._id}`}
                                className="capitalize font-semibold
                                bg-primary px-2 py-1 text-white text-xs
                                rounded-full"
                            >
                                apply
                            </Link>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
