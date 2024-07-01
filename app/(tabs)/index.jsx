import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
    View,
    Text,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
    Image
} from "react-native";
import * as Progress from "react-native-progress";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Industry from "../../components/Industry";
import Toast from "react-native-simple-toast";
import Urgent from "../../components/Urgent";
import Recommend from "../../components/Recommend";
import { useAuth } from "../../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetJobsQuery } from "../../redux/job/jobApiSlice";
import { router } from "expo-router";
import jobtitle from "../../lib/jobtitle";

export default function IndexScreen() {
    const [idx, setIdx] = useState(null);
    const { user } = useAuth();
    const { data } = useGetJobsQuery();
    const [jobs, setJobs] = useState([]);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [list, setList] = useState([]);
    useEffect(() => {
        setLoading(true);
        if (data && data !== undefined) {
            setJobs(data);
            setLoading(false);
        }
    }, [data]);
    const handleBookmark = async item => {
        // await AsyncStorage.clear();

        const res = await AsyncStorage.getItem("gbbk");
        const bks = JSON.parse(res) || [];

        const foundJob = bks.some(j => j._id === item._id);

        if (foundJob) {
            const filtered = bks.filter(f => f._id !== item._id);

            AsyncStorage.setItem("gbbk", JSON.stringify(filtered));
            setList(filtered);
            Toast.show("removed from bookmarks");
            return;
        }
    };

    return (
        <SafeAreaView className="bg-background w-full flex-1">
            <Header
                setModal={setModal}
                setList={setList}
                user={user}
                setIdx={setIdx}
                idx={idx}
            />
            <Industry industries={jobtitle} />

            {loading ? (
                <View className="flex-1 w-full items-center justify-center ">
                    <Progress.Circle
                        size={30}
                        indeterminate={true}
                        borderWidth={2}
                        showsText={true}
                        useNativeDriver={true}
                    />
                </View>
            ) : (
                <>
                    <Urgent jobs={jobs} loading={loading} />
                    <Recommend jobs={jobs} loading={loading} />
                </>
            )}
            <Modal
                className="flex-1 w-full h-full"
                animationType="fade"
                transparent={false}
                visible={modal}
                onRequestClose={() => setModal(false)}
            >
                <Text className="font-semibold capitalize px-4 py-2 ">
                    {idx === "nt" ? "Notifications" : "Bookmarks"}
                </Text>

                <FlatList
                    className=""
                    keyExtractor={({ _id }) => _id}
                    data={list}
                    renderItem={({ item: j }) => {
                        return (
                            j && (
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        setModal(false);
                                        router.push(`/${j._id}`);
                                    }}
                                >
                                    <View className="w-full px-4 my-1">
                                        <View
                                            className=" h-fit w-full bg-card
                        rounded-lg my-1 p-2"
                                        >
                                            <View
                                                className="flex-row items-center
                               "
                                            >
                                                <View
                                                    className="w-12 rounded-md h-12
                                    justify-center items-center bg-card"
                                                >
                                                    <Image
                                                        className="rounded-md w-10 h-10"
                                                        style={{
                                                            resizeMode:
                                                                "contain"
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
                                                        onPress={() =>
                                                            handleBookmark(j)
                                                        }
                                                        className="text-primary"
                                                    >
                                                        <Ionicons
                                                            name="close"
                                                            size={24}
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
                            )
                        );
                    }}
                />
            </Modal>
        </SafeAreaView>
    );
}
