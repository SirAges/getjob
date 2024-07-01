import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";

import {
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    Image
} from "react-native";
import { router } from "expo-router";

export default function Recommend({ jobs }) {
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
if(!jobs?.length){
  return null
}
    return (
        <View className="px-4 flex-1">
            <Text className="px-4 my-1 font-semibold text-md">Recommended</Text>
            <FlatList
                className=""
                keyExtractor={({ _id }) => _id}
                data={jobs}
                renderItem={({ item: j }) => (
                    <TouchableWithoutFeedback
                        onPress={() => router.push(`/${j._id}`)}
                    >
                        <View className="w-full my-1">
                            <View
                                className=" h-fit w-full bg-card
                        rounded-lg my-1 p-2"
                            >
                                <View
                                    className="flex-row items-center space-x-2
                               "
                                >
                                    <View
                                        className="w-12 rounded-md h-12
                                    justify-center items-center bg-card"
                                    >
                                        <Image
                                            className="rounded-md w-10 h-10"
                                            style={{
                                                resizeMode: "contain"
                                            }}
                                            source={{
                                                uri: j.job_company_logo
                                            }}
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text
                                            className="capitalize
                                    text-xs w-full text-title"
                                        >
                                            {j.job_company}
                                        </Text>
                                        <Text
                                            className="text-xs
                                    text-title font-semibold"
                                        >
                                            {j.job_title}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text
                                            onPress={() => handleBookmark(j)}
                                            className="text-primary"
                                        >
                                            <Ionicons
                                                name="bookmark-outline"
                                                size={14}
                                            />
                                        </Text>
                                    </View>
                                </View>
                                <View className="w-full h-[1px] bg-body/10 my-1" />
                                <View
                                    className="flex-row items-center
                            space-x-2"
                                >
                                    <Text
                                        className="text-xs text-body bg-white/70 px-2
                                py-1 rounded-sm capitalize"
                                    >
                                        {`\u20A6${Math.round(
                                            j.job_salary / 1000
                                        )}k/${j.job_salary_type}`}
                                    </Text>
                                    <Text
                                        className="text-xs text-body bg-white/70 px-2
                                py-1 rounded-sm capitalize"
                                    >
                                        {j.job_duration}
                                    </Text>
                                    <Text
                                        className="text-xs text-body bg-white/70 px-2
                                py-1 rounded-sm capitalize"
                                    >
                                        {j.job_type}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            />
        </View>
    );
}
