import { useGetBlogNewsMutation } from "../../redux/blog/blogApiSlice";
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
    const [getBlogNews] = useGetBlogNewsMutation();
    useEffect(() => {
        const getNews = async () => {
            setLoading(true);
            const { data } = await getBlogNews("nigeria");

            if (data && data !== undefined) {
                setBlogs(data?.news);
                setLoading(false);
            }
        };
        getNews();
    }, [getBlogNews]);

    if (loading)
        return (
            <View className=" w-full absolute top-6 justify-center h-full items-center">
                <Progress.Circle
                    size={30}
                    indeterminate={true}
                    borderWidth={2}
                    showsText={true}
                    useNativeDriver={true}
                />
            </View>
        );

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className=" items-center px-2 pt-2 pb-10">
                <Text className="capitalize font-bold p-2">News Update</Text>

                <FlatList
                    className=""
                    keyExtractor={b => b.date}
                    data={blogs}
                    renderItem={({ item: b }) =>
                        b.image && (
                            <TouchableWithoutFeedback
                                onPress={() => router.push(b.url)}
                            >
                                <View className="bg-card p-2 my-1">
                                    <View className="  space-y-2">
                                        <View className="relative h-56">
                                            <Image
                                                className="w-full h-full"
                                                style={{
                                                    resizeMode: "cover"
                                                }}
                                                source={{ uri: b?.image }}
                                            />
                                        </View>

                                        <Text
                                            className="capitalize
              font-semibold"
                                        >
                                            {b.title}
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
