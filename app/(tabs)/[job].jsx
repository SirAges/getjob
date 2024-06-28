import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import * as Progress from "react-native-progress";

import { View, Text, Image, ScrollView } from "react-native";
import { useGlobalSearchParams } from "expo-router";

import Toast from "react-native-simple-toast";
import {
    useGetJobQuery,
    useAddNewJobApplicantMutation
} from "../../redux/job/jobApiSlice";
import { formatDateTime } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import { router } from "expo-router";
export default function JobScreen() {
    const { job: j } = useGlobalSearchParams();
    // const [job, setJob] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, id } = useAuth();
    const { last_name, cv, degree, course, skills } = user;

    const { data: job, isLoading, isFetching } = useGetJobQuery(j);
    const [addNewJobApplicant] = useAddNewJobApplicantMutation();
    const {
        job_title,
        job_description,
        job_industry,
        job_skills,
        job_experience,
        job_degree,

        job_course,

        job_apply_link,
        job_age,
        job_salary,
        job_salary_type,
        job_bonus,
        job_state,
        job_company,
        job_company_logo,

        job_type,
        job_duration,
        job_applicants
    } = job !== undefined && job;
    const prompt = `Dear%20Hiring%20Manager,\n\n%20I%20am%20writing%20to%20express%20my%20interest%20in%20the%20${job_title}%20position%20at%20${job_company},%20as%20advertised.%20With%20${degree}%20in%20${course}%20and%20${job_experience}%20years%20experience,%20I%20am%20equipped%20to%20contribute%20effectively%20to%20your%20organization.%20Your%20job%20description%20aligns%20well%20with%20my%20skills,%20particularly%20in%20${skills},%20and%20I%20am%20eager%20to%20bring%20my%20expertise%20to%20${job_company}.%20I%20am%20drawn%20to%20your%20company's%20commitment%20to%20${job_industry}.%20I%20am%20excited%20about%20the%20opportunity%20to%20discuss%20how%20my%20background,%20skills,%20and%20enthusiasms%20align%20with%20the%20needs%20of%20${job_company}.%20Thank%20you%20for%20considering%20my%20application.%20I%20look%20forward%20to%20the%20possibility%20of%20contributing%20to%20your%20team.\n\nLink%20below%20is%20my%20cv\n${cv}\n\n%20Sincerely,%20${last_name}`;

    const handleApply = async () => {
        setLoading(true);
        try {
            const data = await addNewJobApplicant({
                jobId: j,
                applicantId: id
            });

            Toast.show(data?.error ? data.error.data : data.data);
            if (!data?.error) {
                if (job_apply_link.startsWith("mailto:")) {
                    router.push(
                        `${job_apply_link}?subject=Application%20for%20the%20Position%20of%20${job_title.replace(
                            " ",
                            "%20"
                        )}&body=${prompt}`
                    );
                } else {
                    router.push(job_apply_link);
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Toast.show(error.message);
        }
    };

    if (isLoading || job === undefined || isFetching)
        return (
            <View className=" w-full h-full justify-center items-center">
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
        job &&
        job !== undefined && (
            <View className="bg-white flex-1">
                {loading && (
                    <View className=" w-full absolute top-6 items-center">
                        <Progress.Circle
                            size={30}
                            indeterminate={true}
                            borderWidth={2}
                            showsText={true}
                            useNativeDriver={true}
                        />
                    </View>
                )}
                <View className="flex-row items-center pt-8 pb-4 px-4">
                    <Text onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} />
                    </Text>
                    <Text
                        className="flex-1 text-center font-semibold
                text-lg"
                    >
                        {job_company}
                    </Text>
                    <Text
                        className="bg-card p-1
                 rounded-full"
                    >
                        <Ionicons name="notifications-outline" size={24} />
                    </Text>
                </View>

                <View
                    className="flex-row items-start gap-x-2 px-4 w-screen logo
            "
                >
                    <View
                        className="w-12 rounded-full h-12 bg-card justify-center
                items-center"
                    >
                        <Image
                            className="rounded-full w-10 h-10"
                            style={{ resizeMode: "cover" }}
                            source={{ uri: job_company_logo }}
                        />
                    </View>

                    <View className="w-full px-3">
                        <Text
                            className="text-title   
                        font-extrabold
                           capitalize"
                        >
                            {job_title}
                        </Text>

                        <Text
                            className=" text-body text-xs
                          w-4/5
                             rounded-sm capitalize"
                        >
                            {`${job_company} | ${job_state} | ${job_industry}`}
                        </Text>
                    </View>
                </View>
                <ScrollView className="flex-1">
                    <View className="space-y-3 mb-4">
                        <View className="px-4">
                            <Text
                                className="font-semibold text-md capitalize text-title
                py-2 text-justify"
                            >
                                job details
                            </Text>
                            <Text className="text-body text-sm">
                                {job_description}
                            </Text>
                        </View>
                        <Text className="capitalize font-semibold px-4">
                            Reqirements / Specifications
                        </Text>
                        <View
                            className="flex-row gap-2 flex-wrap px-4 pb-2
                        border-black/10 border-y
                      "
                        >
                            {job_skills.split(",").map((s, i) => (
                                <Text
                                    key={i}
                                    className="bg-card rounded-md px-2 py-1 w-fit
                    capitalize font-medium text-body text-xs"
                                >
                                    {s}
                                </Text>
                            ))}
                        </View>

                        <View className="flex-row gap-2 flex-wrap px-4">
                            <Text
                                className="bg-card rounded-md px-2 py-1 w-fit
                    capitalize font-medium text-body text-xs"
                            >
                                {job_type}
                            </Text>
                            <Text
                                className="bg-card rounded-md px-2 py-1 w-fit
                    capitalize font-medium text-body text-xs"
                            >
                                {job_duration}
                            </Text>
                            <Text
                                className="bg-card rounded-md px-2 py-1 w-fit
                    capitalize font-medium text-body text-xs"
                            >
                                Age: {job_age}
                            </Text>
                            <Text
                                className="bg-card rounded-md px-2 py-1 w-fit
                    capitalize font-medium text-body text-xs"
                            >
                                {`${job_degree}. ${job_course}`}
                            </Text>

                            <Text
                                className="bg-card rounded-md px-2 py-1 w-fit
                    capitalize font-medium text-body text-xs"
                            >
                                {job_experience} years experience
                            </Text>
                            <Text
                                className="bg-card rounded-md px-2 py-1 w-fit
                    capitalize font-medium text-body text-xs"
                            >
                                deadline: {formatDateTime(job?.job_deadline)}
                            </Text>
                        </View>
                        <View className="px-4">
                            <Text
                                className="bg-card rounded-md px-2 py-1 w-fit
                    capitalize font-medium text-body text-sm"
                            >
                                bonus: {job_bonus}
                            </Text>
                        </View>
                        <View className="px-4 space-y-2">
                            <Text className="text-xs text-body ">
                                Applicants
                            </Text>
                            <View className="flex-row space-x-2 items-center px-2">
                                <Text className="text-primary ">
                                    <Ionicons name="people" size={24} />
                                </Text>
                                <Text
                                    className="text-lg font-semibold text-title
                        "
                                >
                                    {job_applicants?.length}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center px-4">
                            <View className="w-1/2 h-20 p-2 ">
                                <View
                                    className="rounded-lg bg-card flex-row
                                h-full  items-center space-x-2 p-2"
                                >
                                    <View
                                        className="items-center justify-center w-7 h-7
                            bg-white/70
                       rounded-full"
                                    >
                                        <Text
                                            className="text-primary
                       "
                                        >{`\u20A6`}</Text>
                                    </View>
                                    <View>
                                        <Text
                                            className="text-sm text-body
                             rounded-sm capitalize"
                                        >
                                            {`${job_salary_type} salary`}
                                        </Text>
                                        <Text className="font-semibold text-lg text-title">
                                            {job_salary / 1000}k
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View className="w-1/2 h-20 p-2 ">
                                <View
                                    className="rounded-lg bg-card flex-row
                    items-center space-x-2 h-full p-2"
                                >
                                    <View
                                        className="items-center justify-center w-7 h-7
                            bg-white/70
                       rounded-full"
                                    >
                                        <Text
                                            className="text-primary
                       "
                                        >
                                            <Ionicons name="briefcase" />
                                        </Text>
                                    </View>
                                    <View>
                                        <Text
                                            className="text-sm text-body
                             rounded-sm capitalize"
                                        >
                                            job type
                                        </Text>
                                        <Text
                                            className="font-semibold text-lg text-title
                            capitalize"
                                        >
                                            {job_type}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Text
                            onPress={loading ? null : handleApply}
                            className="text-white bg-primary rounded-full
                            py-4 mx-4 text-center
                        px-4"
                        >
                            Apply now
                        </Text>
                    </View>
                </ScrollView>
            </View>
        )
    );
}
