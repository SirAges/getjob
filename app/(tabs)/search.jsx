import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import { useGetJobsQuery } from "../../redux/job/jobApiSlice";
import {
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    ScrollView
} from "react-native";

import { router, useGlobalSearchParams } from "expo-router";
export default function SearchScreen() {
    const [search, setSearch] = useState("");
    const { data } = useGetJobsQuery();
    const [jobs, setJobs] = useState([]);

    const [filters, setFilters] = useState(false);
    const { searchparams } = useGlobalSearchParams();

    const [filterItem, setFilterItem] = useState({
        salaryRange: null,
        jobType: null,
        jobDuration: null,
        salaryType: null
    });
    const [loading] = useState("");

    useEffect(() => {
        const getSearch = () => {
            if (
                search ||
                Object.values(filterItem).some(item => item !== null) ||
                searchparams
            ) {
                const filtered = data.filter(job => {
                    // Apply search filter
                    const searchMatch =
                        job.job_title
                            .toLowerCase()
                            .includes(
                                search.toLowerCase() ||
                                    searchparams.toLowerCase()
                            ) ||
                        job.job_description
                            .toLowerCase()
                            .includes(
                                search.toLowerCase() ||
                                    searchparams.toLowerCase()
                            );

                    // Apply optional filters
                    const salaryTypeMatch =
                        !filterItem.salaryType ||
                        job.job_salary_type === filterItem.salaryType;
                    const jobTypeMatch =
                        !filterItem.jobType ||
                        job.job_type === filterItem.jobType;
                    const jobDurationMatch =
                        !filterItem.jobDuration ||
                        job.job_duration === filterItem.jobDuration;
                    const salaryRangeMatch =
                        !filterItem.salaryRange ||
                        (job.job_salary / 1000)?.toString()?.length <
                            filterItem.salaryRange?.length;

                    return (
                        searchMatch &&
                        salaryTypeMatch &&
                        jobTypeMatch &&
                        jobDurationMatch &&
                        salaryRangeMatch
                    );
                });

                setJobs(filtered.length ? filtered : []);
            } else {
                setJobs([]);
            }
        };
        getSearch();
    }, [search, filterItem, searchparams, data]);

    const checkbox = (list, clicked) => {
        return (
            <View className="py-4">
                {list.map(l => (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setFilterItem(prev =>
                                prev[clicked] === l
                                    ? { ...prev, [clicked]: null }
                                    : { ...prev, [clicked]: l }
                            );
                        }}
                    >
                        <View className="flex-row items-center space-x-2 py-2">
                            {filterItem[clicked] === l ? (
                                <Text className="text-primary">
                                    <Ionicons
                                        name="checkbox-outline"
                                        size={26}
                                    />
                                </Text>
                            ) : (
                                <Text className="text-primary">
                                    <MaterialIcons
                                        width={2}
                                        name="check-box-outline-blank"
                                        size={26}
                                    />
                                </Text>
                            )}
                            <Text>{l}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                ))}
            </View>
        );
    };
    return (
        <View className="px-0 bg-background flex-1">
            <Text>{search}</Text>
            {filters && (
                <View
                    className="items-end w-full h-full bg-black/20
                    
            "
                >
                    <View
                        className=" absolute w-3/4 h-full bg-white pt-12
                        shadow-lg 
            px-4
            shadow-black"
                    >
                        <Text
                            onPress={() => setFilters(false)}
                            className="absolute z-50 flex-1 text-center font-semibold
                text-lg top-4 right-5"
                        >
                            <Ionicons name="close" size={24} />
                        </Text>
                        <Text
                            onPress={() =>
                                setFilterItem({
                                    salaryRange: null,
                                    salaryType: null,
                                    jobDuration: null,
                                    jobType: null
                                })
                            }
                            className="absolute z-50 text-center
                text-xs top-4 left-5"
                        >
                            clear filters
                        </Text>
                        <ScrollView className="">
                            <Text
                                className="capitalize font-semibold text-md
                        text-title"
                            >
                                Salary range
                            </Text>
                            {checkbox(
                                [
                                    "\u20A6",
                                    "\u20A6 \u20A6",
                                    "\u20A6 \u20A6 \u20A6"
                                ],
                                "salaryRange"
                            )}
                            <Text
                                className="capitalize font-semibold text-md
                        text-title"
                            >
                                Job Type
                            </Text>
                            {checkbox(
                                ["remote", "onsite", "hybrid"],
                                "jobType"
                            )}
                            <Text
                                className="capitalize font-semibold text-md
                        text-title"
                            >
                                Job duration
                            </Text>
                            {checkbox(
                                ["part time", "full time", "contract"],
                                "jobDuration"
                            )}
                            <Text
                                className="capitalize font-semibold text-md
                        text-title"
                            >
                                salary type
                            </Text>
                            {checkbox(
                                [
                                    "daily",
                                    "weekly",
                                    "monthly",
                                    "quarterly",
                                    "yearly",
                                    "contract"
                                ],
                                "salaryType"
                            )}
                        </ScrollView>
                    </View>
                </View>
            )}

            <View className="flex-row items-center py-2 px-2 space-x-2 mt-8">
                <Text onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} />
                </Text>

                <View className="flex-1">
                    <TextInput
                        className="px-2 py-2 space-x-2 rounded-full shadow 
                           shadow-black shadow-lg bg-card outline-2 w-full
                           text-body"
                        editable={!loading}
                        placeholderTextColor={"#0039fd88"}
                        placeholder="search for jobs now"
                        onChangeText={text => setSearch(text)}
                        value={search}
                        inputMode={"text"}
                        spellcheck={false}
                    />
                </View>
                <Text
                    className="bg-card p-1
                 rounded-full"
                >
                    <Ionicons
                        onPress={() => setFilters(prev => !prev)}
                        name="filter-outline"
                        size={24}
                    />
                </Text>
            </View>
            {!jobs.length ? (
                <View className="flex-1 items-center justify-center">
                    <Image
                        className="w-3/4 h-44"
                        style={{ resizeMode: "contain" }}
                        source={require("../../assets/images/find.jpg")}
                    />
                    <Text className="py-2 font-semibold capitalize text-primary">
                        Start your job search here
                    </Text>
                </View>
            ) : (
                <FlatList
                    className="px-2"
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

                                        <View
                                            className=" space-y-1 bg-black/5
                                            p-2
                                        rounded-md"
                                        >
                                            <Text className="text-xs text-body ">
                                                Applicants
                                            </Text>
                                            <View className="flex-row space-x-2 items-center px-2">
                                                <Text className="text-primary ">
                                                    <Ionicons
                                                        name="people"
                                                        size={14}
                                                    />
                                                </Text>
                                                <Text
                                                    className="text-xs font-semibold text-title
                        "
                                                >
                                                    {j.job_applicants?.length}
                                                </Text>
                                            </View>
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
                                        <Text
                                            className="text-xs text-body bg-white/70 px-2
                                py-1 rounded-sm capitalize"
                                        >
                                            {j.job_state}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />
            )}
        </View>
    );
}
