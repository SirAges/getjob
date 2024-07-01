import Toast from "react-native-simple-toast";
import jobtitle from "../../lib/jobtitle";
import { useSocket } from "../../lib/socket.js";
import { list } from "../../lib/data";

import { sendPushNotification } from "../../lib/notify";
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    Modal,
    Dimensions,
    FlatList
} from "react-native";
import * as Progress from "react-native-progress";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import FilePicker from "../../components/FilePicker";
import DatePicker from "../../components/DatePicker";
import Highlight from "../../components/Highlight";
import Select from "../../components/Select";
import {
    Titl_desc_indu_state,
    Skill_expe_educ_age,
    comp_logo_Web_appl,
    type_dura_sala_bonus,
    Imag
} from "../../lib/form";

import { useAddNewJobMutation } from "../../redux/job/jobApiSlice";

export default function IndexScreen() {
    const socket = useSocket();

    const screenWidth = Dimensions.get("window").width;

    const [formField, setFormField] = useState(Titl_desc_indu_state);

    const [isNext, setIsNext] = useState("title");
    const [loading, setLoading] = useState(false);
    const [idx, setIdx] = useState(null);
    const [select, setSelect] = useState(false);
    const [selectList, setSelectList] = useState([]);
    const [addNewJob] = useAddNewJobMutation();

    const initialValues = {
        job_title: "",
        job_description: "",
        job_industry: "",
        job_skills: "",
        job_experience: 0,
        job_degree: "",
        job_deadline: "",
        job_course: "",
        job_website: "",
        job_apply_link: "",
        job_age: "> 18",
        job_salary: 0,
        job_salary_type: "monthly",
        job_bonus: "",
        job_state: "",
        job_company: "",
        job_company_logo: "",
        job_job_image: "",
        job_type: "onsite",
        job_duration: "full time"
    };
    const schema = z.object({
        job_title: z
            .string()
            .min(1, { message: "Title must be at least 1 character long" }),
        job_description: z
            .string()
            .min(1, { message: "Description is required" }),
        job_industry: z.string().min(1, { message: "Industry is required" }),
        job_skills: z.string(),
        job_experience: z
            .number()
            .min(1, { message: "Experience is required" }),
        job_degree: z.string(),
        job_deadline: z.string({
            message: "Deadline is required or date is invalid"
        }),
        job_course: z.string(),
        job_website: z.string(),
        job_apply_link: z.string().refine(
            value => {
                return value.includes("https://") || value.includes("@");
            },
            {
                message:
                    "Invalid URL format. Only HTTP(S) and mailto links are allowed."
            }
        ),
        job_age: z.string(),
        job_salary: z.number(),
        job_salary_type: z.string(),
        job_bonus: z.string(),
        job_state: z.string().min(1, { message: "State is required" }),
        job_company: z.string().min(1, { message: "Company is required" }),
        job_company_logo: z.string(),
        job_image: z.string(),
        job_type: z.string().min(1, { message: "Job type is required" }),
        job_duration: z.string().min(1, { message: "Duration is required" })
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        control,
        reset
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialValues
    });

    useEffect(() => {
        formField.forEach(({ id }) => {
            watch(id);
        });
    }, [formField, watch]);

    const handleReset = () => {
        reset(initialValues);
    };

    const handleInput = (id, text) => {
        setValue(id, text);
    };
    const {
        job_title,
        job_description,
        job_industry,

        job_experience,

        job_apply_link,

        job_state,
        job_company,
        job_company_logo,
        job_image,
        job_type,
        job_duration
    } = watch();
    const handleNext = () => {
        const stepConditions = {
            title: job_title && job_description && job_industry && job_state,

            skill:
                job_title &&
                job_description &&
                job_industry &&
                job_experience &&
                job_state,
            type:
                job_title &&
                job_description &&
                job_industry &&
                job_experience &&
                job_state &&
                job_type &&
                job_duration,
            comp:
                job_title &&
                job_description &&
                job_industry &&
                job_experience &&
                job_state &&
                job_apply_link &&
                job_company &&
                job_type &&
                job_company_logo,

            Imag:
                job_title &&
                job_description &&
                job_industry &&
                job_experience &&
                job_apply_link &&
                job_state &&
                job_company &&
                job_type &&
                job_duration
        };

        const nextStep = {
            title: { formField: Skill_expe_educ_age, next: "skill" },
            skill: { formField: type_dura_sala_bonus, next: "type" },
            type: { formField: comp_logo_Web_appl, next: "comp" },
            comp: { formField: Imag, next: "Imag" },

            Imag: { formField: Imag, next: null }
        };

        const currentStep = nextStep[isNext];
        if (!currentStep) return;

        const { formField: nextFormField, next: nextStepName } = currentStep;
        if (stepConditions[isNext]) {
            setFormField(nextFormField);
            setIsNext(nextStepName);
        }
    };
    const handlePrev = () => {
        const prevStep = getPrevStep(isNext);
        if (prevStep) {
            setFormField(prevStep.formField);
            setIsNext(prevStep.name);
        }
    };

    const getPrevStep = currentStep => {
        const steps = [
            { name: "title", formField: Titl_desc_indu_state },
            { name: "skill", formField: Skill_expe_educ_age },
            { name: "type", formField: type_dura_sala_bonus },
            { name: "comp", formField: comp_logo_Web_appl },

            { name: "Imag", formField: Imag }
        ];
        const currentIndex = steps.findIndex(step => step.name === currentStep);
        if (currentIndex > 0) {
            return steps[currentIndex - 1];
        }
        return null;
    };

    const onSubmit = async val => {
        setLoading(true);

        try {
            const data = await addNewJob(val);
        
            const pushTokens = socket.on("pushTokens", data => {
                return data;
            });

            if (!data?.error) {
                const j = data.data;
                const notMessage = {
                    to: pushTokens,
                    title: j.title,
                    body: j.job_company,
                    data: {
                        ...j,
                        seen: false,

                        url: data?.data?._id
                    }
                };
                sendPushNotification(notMessage);
                Toast.show("Job created successfully");
                setFormField(Titl_desc_indu_state);
                handleReset();
                setLoading(false);
            } else {
                Toast.show(data?.error?.data);
                setLoading(false);
            }
        } catch (error) {
            Toast.show(error.message);
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 flex bg-background">
            {
                <Progress.Bar
                    width={screenWidth}
                    progress={
                        isNext === "title"
                            ? 0.2
                            : isNext === "skill"
                            ? 0.4
                            : isNext === "type"
                            ? 0.6
                            : isNext === "comp"
                            ? 0.8
                            : 1
                    }
                    showsText={true}
                    borderRadius={0}
                    useNativeDriver={true}
                    color="#53a65e"
                    animated={true}
                />
            }

            {loading && (
                <View className=" w-full items-center">
                    <Progress.Circle
                        size={30}
                        indeterminate={true}
                        borderWidth={2}
                        showsText={true}
                        useNativeDriver={true}
                        color="#53a65e"
                    />
                </View>
            )}

            <ScrollView>
                <View
                    className="px-5 my-6 flex justify-center flex-1 space-y-4
                items-center"
                >
                    <View className="relative w-full ">
                        <Image
                            className="w-full h-52"
                            style={{ resizeMode: "contain" }}
                            source={require("../../assets/images/find.jpg")}
                        />
                    </View>

                    {formField.map(
                        ({
                            placeholder,
                            type,
                            id,
                            multiline,
                            label,
                            ...rest
                        }) => (
                            <View key={id} className="w-full">
                                {id === "job_degree" ? (
                                    <Highlight
                                        id={id}
                                        handleInput={handleInput}
                                        watch={watch}
                                        label={label}
                                        list={[
                                            "nd",
                                            "hnd",
                                            "bsc",
                                            "msc",
                                            "phd",
                                            "prof"
                                        ]}
                                    />
                                ) : id === "job_age" ? (
                                    <Highlight
                                        id={id}
                                        handleInput={handleInput}
                                        watch={watch}
                                        label={label}
                                        list={[
                                            "> 18",
                                            "25 - 27",
                                            "27 - 30",
                                            "> 30"
                                        ]}
                                    />
                                ) : id === "job_salary_type" ? (
                                    <Highlight
                                        id={id}
                                        handleInput={handleInput}
                                        watch={watch}
                                        label={label}
                                        list={[
                                            "daily",
                                            "weekly",
                                            "monthly",
                                            "quarterly",
                                            "yearly",
                                            "contract"
                                        ]}
                                    />
                                ) : id === "job_type" ? (
                                    <Highlight
                                        id={id}
                                        handleInput={handleInput}
                                        watch={watch}
                                        label={label}
                                        list={["remote", "onsite", "hybrid"]}
                                    />
                                ) : id === "job_duration" ? (
                                    <Highlight
                                        id={id}
                                        handleInput={handleInput}
                                        watch={watch}
                                        label={label}
                                        list={[
                                            "part time",
                                            "full time",
                                            "contract"
                                        ]}
                                    />
                                ) : id === "job_image" ||
                                  id === "job_company_logo" ? (
                                    <FilePicker
                                        label={label}
                                        key={id}
                                        id={id}
                                        setValue={setValue}
                                        type={[
                                            "image/png",
                                            "image/jpg",
                                            "image/jpeg"
                                        ]}
                                        watch={watch}
                                    />
                                ) : id === "job_deadline" ? (
                                    <DatePicker
                                        label={label}
                                        key={id}
                                        id={id}
                                        setValue={setValue}
                                        watch={watch}
                                    />
                                ) : id === "job_title" ? (
                                    watch("job_industry") && (
                                        <Select
                                            key={id}
                                            label={label}
                                            id={id}
                                            idx={idx}
                                            setIdx={setIdx}
                                            setValue={setValue}
                                            select={select}
                                            selectList={selectList}
                                            setSelectList={setSelectList}
                                            list={Object.entries(
                                                jobtitle
                                            ).flatMap(([key, value]) =>
                                                key === watch("job_industry") &&
                                                value
                                                    ? value
                                                    : []
                                            )}
                                            setSelect={setSelect}
                                            watch={watch}
                                        />
                                    )
                                ) : id === "job_state" ? (
                                    <Select
                                        key={id}
                                        id={id}
                                        idx={idx}
                                        setIdx={setIdx}
                                        label={label}
                                        setValue={setValue}
                                        select={select}
                                        list={list}
                                        selectList={selectList}
                                        setSelectList={setSelectList}
                                        setSelect={setSelect}
                                        watch={watch}
                                    />
                                ) : id === "job_industry" ? (
                                    <Select
                                        key={id}
                                        id={id}
                                        idx={idx}
                                        label={label}
                                        setIdx={setIdx}
                                        setValue={setValue}
                                        select={select}
                                        list={Object.keys(jobtitle).flatMap(
                                            k => k
                                        )}
                                        selectList={selectList}
                                        setSelectList={setSelectList}
                                        setSelect={setSelect}
                                        watch={watch}
                                    />
                                ) : (
                                    <Controller
                                        key={id}
                                        control={control}
                                        name={id}
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, onBlur, value }
                                        }) => (
                                            <View
                                                className="flex items-start
                                              space-y-2 w-full"
                                            >
                                                <Text
                                                    className="capitalize text-md font-semibold text-title
                            px-6 "
                                                >
                                                    {label}
                                                </Text>

                                                <TextInput
                                                    style={{
                                                        textAlignVertical:
                                                            multiline
                                                                ? "top"
                                                                : null
                                                    }}
                                                    className={`px-4 py-4
                                                ${
                                                    multiline
                                                        ? "rounded-md max-h-52"
                                                        : "rounded-full"
                                                }
                                                shadow
                           shadow-black shadow-lg bg-card outline-2 w-full
                           text-body`}
                                                    editable={true}
                                                    onSubmitEditing={() =>
                                                        onSubmit(watch())
                                                    }
                                                    returnKeyType="done"
                                                    multiline={multiline}
                                                    numberOfLines={
                                                        multiline && 10
                                                    }
                                                    placeholderTextColor={
                                                        "#53a65e"
                                                    }
                                                    placeholder={placeholder}
                                                    onChangeText={text =>
                                                        handleInput(id, text)
                                                    }
                                                    value={value}
                                                    inputMode={type}
                                                    spellcheck={false}
                                                    {...register(id, {
                                                        valueAsNumber:
                                                            type === "numeric"
                                                                ? true
                                                                : false
                                                    })}
                                                    {...rest}
                                                />
                                            </View>
                                        )}
                                    />
                                )}
                                {errors[id]?.message && (
                                    <Text
                                        className="text-red-500
                                              text-xs italic px-6"
                                    >
                                        {errors[id].message &&
                                            errors[id].message}
                                    </Text>
                                )}
                            </View>
                        )
                    )}

                    <View className="flex flex-row items-center justify-between">
                        {isNext !== "title" && (
                            <View className="items-end px-6 py-2">
                                <Text
                                    onPress={handlePrev}
                                    className=" text-primary capitalize font-semibold
                    "
                                >
                                    Prev
                                </Text>
                            </View>
                        )}
                        <View className="flex-1" />
                        {isNext !== "Imag" && (
                            <View className="items-end px-6 py-2">
                                <Text
                                    onPress={handleNext}
                                    className=" text-primary capitalize font-semibold
                    "
                                >
                                    Next
                                </Text>
                            </View>
                        )}
                    </View>

                    {job_image && (
                        <Text
                            className="px-4 py-4  rounded-full shadow
                           shadow-black shadow-lg bg-primary w-full text-center
                           capitalize font-semibold
                           text-white"
                            onPress={handleSubmit(onSubmit)}
                        >
                            create job
                        </Text>
                    )}
                </View>
            </ScrollView>
            <Modal
                className="flex-1 w-full h-full"
                animationType="fade"
                transparent={false}
                visible={select}
                onRequestClose={() => setSelect(false)}
            >
                <FlatList
                    keyExtractor={(t, i) => i}
                    data={selectList}
                    renderItem={({ item: t }) => (
                        <Text
                            onPress={() => {
                                handleInput(idx, t);
                                setSelect(false);
                            }}
                            className="px-4 py-5 my-2 rounded-full shadow
                           shadow-black shadow-lg bg-card outline-2  w-full
                           "
                        >
                            {t}
                        </Text>
                    )}
                />
            </Modal>
        </SafeAreaView>
    );
}
