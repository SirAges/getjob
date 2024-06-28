import { useGetBlogNewsQuery } from "../../redux/blog/blogApiSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    Image
} from "react-native";
import * as Progress from "react-native-progress";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
export default function BlogScreen() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { data } = useGetBlogNewsQuery();

    useEffect(() => {
        const getNews = async () => {
            setLoading(true);

            if (data && data !== undefined) {
                setBlogs(data?.news);
                setLoading(false);
            }
        };
        if (!blogs?.length) {
            getNews();
        }
    }, [data]);

    if (loading)
        return (
            <View className=" w-full absolute top-6 justify-center h-full items-center">
                <Progress.Circle
                    size={30}
                    indeterminate={true}
                    borderWidth={2}
                    showsText={true}
                    color="#53a65e"
                    useNativeDriver={true}
                />
            </View>
        );
    if (!blogs?.length) {
        return (
            <View className="flex-1 items-center justify-center space-y-2">
                <Text className="text-primary">
                    <Ionicons name="newspaper" size={50} />
                </Text>
                <Text className="capitalize font-semibold">
                    No news available now
                </Text>
                <Text className="capitalize font-semibold">
                    Please try again later
                </Text>
            </View>
        );
    }
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className=" items-center px-2 pt-2 pb-10">
                <Text className="capitalize font-bold p-2">News Update</Text>

                <FlatList
                    className=""
                    keyExtractor={b => b.Url}
                    data={blogs}
                    renderItem={({ item: b }) =>
                        b.Image && (
                            <TouchableWithoutFeedback
                                onPress={() => router.push(b.Url)}
                            >
                                <View className="bg-card p-2 my-1">
                                    <View className="  space-y-2">
                                        <View className="relative h-56">
                                            <Image
                                                className="w-full h-full"
                                                style={{
                                                    resizeMode: "cover"
                                                }}
                                                source={{ uri: b?.Image }}
                                            />
                                        </View>

                                        <Text
                                            className="capitalize
              font-semibold"
                                        >
                                            {b.Title}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }
                />
            </View>
        </SafeAreaView>
    );
}
