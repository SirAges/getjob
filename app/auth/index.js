import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    Modal,
    Dimensions,
    FlatList,
    TouchableWithoutFeedback
} from "react-native";
import * as Progress from "react-native-progress";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import FilePicker from "../../components/FilePicker";
import Select from "../../components/Select";
import Highlight from "../../components/Highlight";
import {
    email_pass,
    user_first_last,
    addr_city_state,
    skill_edu_age,
    cv_image
} from "../../lib/form";
import { jwtDecode } from "jwt-decode";
import { list } from "../../lib/data";
import {
    useSignupMutation,
    useLoginMutation,
    useResetPasswordMutation
} from "../../redux/auth/authApiSlice.js";
import { useUpdateUserMutation } from "../../redux/user/userApiSlice";

export default function IndexScreen() {
    const screenWidth = Dimensions.get("window").width;

    const [formField, setFormField] = useState(email_pass);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [hidePassword, setHidePassword] = useState(true);
    const [pReset, setPReset] = useState(false);
    const [isVerified, setIsverified] = useState(false);

    const [persist, setPersist] = useState(async () => {
        const persistData = await AsyncStorage.getItem("persist");
        const res = JSON.parse(persistData);
        setPersist(res || false);
    });

    const [loading, setLoading] = useState(false);
    const [idx, setIdx] = useState(null);
    const [pwd, setPwd] = useState({ password: "", cpassword: "" });
    const [select, setSelect] = useState(false);
    const [isOtp, setIsOtp] = useState(null);
    const [userId, setUserId] = useState(null);
    const [otp, setOtp] = useState("");
    const [otpToken, setOtpToken] = useState("");

    const [selectList, setSelectList] = useState([]);
    const [isNext, setIsNext] = useState("email");
    const [resetpwd, setResetpwd] = useState("");

    const [resetpassword] = useResetPasswordMutation();
    const [updateUser] = useUpdateUserMutation();

    const [login] = useLoginMutation();
    const [signup] = useSignupMutation();
    const logInitialValues = {
        email: "",
        password: ""
    };
    const logSchema = z.object({
        email: z.string().email({ message: "invalid email address " }),
        password: z.string().min(6, {
            message: "password must be at least 6 characters long"
        })
    });

    const regInitialValues = {
        prefered_job: "",
        email: "",

        password: "",
        comfirm_password: "",
        first_name: "",
        last_name: "",
        address: "",
        city: "",
        state: "",
        skills: "",
        degree: "",
        age: 18,
        cv: ""
    };
    const regSchema = z.object({
        prefered_job: z
            .string()
            .min(1, { message: "Title must be at least 10 characters long" })
            .max(100, { message: "Title cannot exceed 40 characters" }),
        email: z.string().email({ message: "invalid email address " }),
        password: z.string().min(6, {
            message: "password must be at least 6 characters long"
        }),
        comfirm_password: z.string().min(6, {
            message: "password must be at least 6 characters long"
        }),
        first_name: z.string().min(1, { message: "first name is required" }),
        last_name: z.string().min(1, { message: "last name is required" }),
        image: z.string().min(1, { message: "address is required" }),
        address: z.string().min(1, { message: "address is required" }),
        city: z.string().min(1, { message: "city is required" }),
        state: z.string().min(1, { message: "state is required" }),
        skills: z.string().min(1, { message: "state is required" }),
        degree: z.string().min(1, { message: "degree is required" }),
        age: z.number().min(18, { message: "age is required" }),
        cv: z.string().min(2, { message: "cv is required" })
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
        resolver: zodResolver(isLoginMode ? logSchema : regSchema),
        defaultValues: isLoginMode ? logInitialValues : regInitialValues
    });

    useEffect(() => {
        formField.forEach(({ id }) => {
            watch(id);
        });
    }, [formField, watch, isLoginMode]);

    const handleReset = () => {
        reset(isLoginMode ? regInitialValues : logInitialValues);
    };
    const passwordMatch = watch("password") === watch("comfirm_password");

    const { cv } = watch();

    const handleInput = (id, text) => {
        setValue(id, text);
    };
    const handleSwitch = () => {
        handleReset();
        setFormField(email_pass);
        setIsNext("email");
        setIsLoginMode(prev => !prev);
    };

    const handleNext = () => {
        const formData = watch();
        const {
            email,
            password,
            prefered_job,
            first_name,
            last_name,
            state,
            address,
            city,
            skills,
            degree,
            course,
            age,
            image
        } = formData;

        const stepConditions = {
            email: email && password && passwordMatch,
            user:
                email &&
                password &&
                passwordMatch &&
                prefered_job &&
                first_name &&
                last_name,

            addr:
                email &&
                password &&
                passwordMatch &&
                prefered_job &&
                first_name &&
                last_name &&
                state &&
                address &&
                city,

            skill:
                email &&
                password &&
                passwordMatch &&
                prefered_job &&
                first_name &&
                last_name &&
                state &&
                address &&
                city &&
                skills &&
                degree &&
                course &&
                age,
            cv:
                email &&
                password &&
                passwordMatch &&
                prefered_job &&
                first_name &&
                last_name &&
                state &&
                address &&
                city &&
                skills &&
                degree &&
                course &&
                age &&
                cv &&
                image
        };

        const nextStep = {
            email: { formField: user_first_last, next: "user" },
            user: { formField: addr_city_state, next: "addr" },
            addr: { formField: skill_edu_age, next: "skill" },
            skill: { formField: cv_image, next: "cv" },
            cv: { formField: cv_image, next: null }
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
            { name: "email", formField: email_pass },
            { name: "user", formField: user_first_last },
            { name: "addr", formField: addr_city_state },
            { name: "skill", formField: skill_edu_age },
            { name: "cv", formField: cv_image }
        ];
        const currentIndex = steps.findIndex(step => step.name === currentStep);
        if (currentIndex > 0) {
            return steps[currentIndex - 1];
        }
        return null;
    };

    const onSubmit = async val => {
        const { cv } = val;
        setLoading(true);

        try {
            if (cv) {
                const data = await signup(val);

                if (!data?.error) {
                    setIsLoginMode(true);
                }
                Toast.show(data?.error ? data?.error?.data : data?.data);
                setLoading(false);
            } else {
                const data = await login(val);

                if (!data?.error) {
                    router.replace("(tabs)");
                }
                Toast.show(
                    data?.error ? data?.error?.data : "Successfully logged in"
                );
                setLoading(false);
            }
        } catch (error) {
            Toast.show(error.message);
            setLoading(false);
        }
    };
    useEffect(() => {
        const getPersist = async () => {
            AsyncStorage.setItem("persist", JSON.stringify(persist));

            // const persisted = await AsyncStorage.getItem("persist");
            // const res = JSON.parse(persisted);
            // alert(res === (true || false) && res);
            // dispatch(setAsyncPersist(res === (true || false) && res));
        };

        getPersist();
    }, [persist]);
    const handlePersist = () => {
        setPersist(prev => !prev);
    };
    const handleChangePwd = async () => {
        if (pwd.password !== pwd.cpassword) {
            Toast.show("passwords fo not match");
            return;
        }

        try {
            const data = await updateUser({ userId, password: pwd.password });

            Toast.show(data?.error ? data?.error?.data : data?.data);
            setPReset(false);
            setIsverified(false);
            setLoading(false);
        } catch (error) {
            Toast.show(error.message);
            setLoading(false);
        }
    };
    const handleResetPwd = async () => {
        try {
            setLoading(true);
            if (isOtp) {
                const { exp, otp: tokenotp, id } = jwtDecode(otpToken);
                const date = new Date().getTime();
                const isExp = exp - date / 1000;
                if (otp && isExp < 0) {
                    Toast.show("otp expired");
                    setLoading(false);
                    setOtpToken(null);
                    setIsOtp(null);
                    setOtp("");
                    return;
                }
                if (otp === tokenotp) {
                    setUserId(id);
                    setOtp("");
                    setIsOtp(null);
                    setIsverified(true);
                    setLoading(false);
                    return;
                }
            } else {
                if (!resetpwd.includes("@")) {
                    Toast.show("invalid email address");
                    return;
                }
                const data = await resetpassword({ email: resetpwd });
                if (!data?.error) {
                    setOtpToken(data.data);
                    setIsOtp(true);
                    Toast.show("otp sent to email");
                    setResetpwd("");
                    setLoading(false);
                } else {
                    Toast.show(data.error.data);
                    setLoading(false);
                
                }
            }
        } catch (error) {
            Toast.show(error.message);
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 flex bg-background">
            {!isLoginMode && (
                <Progress.Bar
                    width={screenWidth}
                    progress={
                        isNext === "email"
                            ? 0.2
                            : isNext === "user"
                            ? 0.4
                            : isNext === "addr"
                            ? 0.6
                            : isNext === "skill"
                            ? 0.8
                            : 1
                    }
                    color="#53a65e"
                    showsText={true}
                    borderRadius={0}
                    useNativeDriver={true}
                    animated={true}
                />
            )}

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
                            source={require("../../assets/images/job.jpg")}
                        />
                    </View>
                    {isLoginMode ? (
                        <View className="w-full">
                            {email_pass.map(
                                ({ placeholder, type, id, label, ...rest }) =>
                                    id !== "comfirm_password" && (
                                        <Controller
                                            key={id}
                                            name={id}
                                            rules={{ required: true }}
                                            control={control}
                                            render={({
                                                field: {
                                                    onChange,
                                                    onBlur,
                                                    value
                                                }
                                            }) => (
                                                <View
                                                    className="flex items-start
                                              space-y-2 w-full"
                                                >
                                                    <Text
                                                        className="capitalize text-md font-semibold text-title
                            px-6"
                                                    >
                                                        {label}
                                                    </Text>
                                                    <TextInput
                                                        className="px-4 py-4  rounded-full shadow
                           shadow-black shadow-lg bg-card outline-2 w-full
                           text-body"
                                                        editable={!loading}
                                                        secureTextEntry={
                                                            (id ===
                                                                "password" ||
                                                                id ===
                                                                    "comfirm_password") &&
                                                            hidePassword
                                                        }
                                                        placeholderTextColor={
                                                            "#53a65e"
                                                        }
                                                        placeholder={
                                                            placeholder
                                                        }
                                                        onChangeText={text =>
                                                            handleInput(
                                                                id,
                                                                text
                                                            )
                                                        }
                                                        value={value}
                                                        inputMode={type}
                                                        spellcheck={false}
                                                        {...register(id, {
                                                            valueAsNumber:
                                                                type ===
                                                                "numeric"
                                                                    ? true
                                                                    : false
                                                        })}
                                                        {...rest}
                                                    />
                                                    {(id === "password" ||
                                                        id ===
                                                            "comfirm_password") && (
                                                        <Text
                                                            onPress={() =>
                                                                setHidePassword(
                                                                    prev =>
                                                                        !prev
                                                                )
                                                            }
                                                            className="absolute
                                                right-3 top-1/2 text-primary"
                                                        >
                                                            <Ionicons
                                                                size={16}
                                                                name={
                                                                    hidePassword
                                                                        ? "eye"
                                                                        : "eye-off"
                                                                }
                                                            />
                                                        </Text>
                                                    )}
                                                    {errors[id]?.message && (
                                                        <Text className="px-6 text-red-500 text-xs italic">
                                                            {!passwordMatch &&
                                                            id ===
                                                                "confirm_password"
                                                                ? "Passwords don't match"
                                                                : errors[id]
                                                                      .message}
                                                        </Text>
                                                    )}
                                                </View>
                                            )}
                                        />
                                    )
                            )}
                            <View
                                className="px-8 py-4 items-center flex-row
                           space-x-4"
                            >
                                <Text
                                    onPress={() => setPReset(true)}
                                    className="text-primary text-xs
                                    font-medium capitalize"
                                >
                                    forgot Passwords
                                </Text>
                                <TouchableWithoutFeedback
                                    onPress={handlePersist}
                                >
                                    <View
                                        className="px-8 py-4 items-center flex-row
                            justify-end space-x-4"
                                    >
                                        <Text className="font-medium capitalize">
                                            i trust this device
                                        </Text>
                                        <Text className="text-primary">
                                            <Ionicons
                                                size={20}
                                                name={
                                                    persist
                                                        ? "shield"
                                                        : "shield-outline"
                                                }
                                            />
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    ) : (
                        formField.map(
                            ({ placeholder, type, id, label, ...rest }) =>
                                id === "image" ? (
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
                                ) : id === "degree" ? (
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
                                ) : id === "cv" ? (
                                    <FilePicker
                                        key={id}
                                        id={id}
                                        setValue={setValue}
                                        type={["application/pdf"]}
                                        watch={watch}
                                    />
                                ) : id === "state" ? (
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
                            px-6"
                                                >
                                                    {label}
                                                </Text>

                                                <TextInput
                                                    className="px-4 py-4  rounded-full shadow
                           shadow-black shadow-lg bg-card outline-2 w-full
                           text-body"
                                                    editable={!loading}
                                                    onSubmitEditing={handleNext}
                                                    secureTextEntry={
                                                        (id === "password" ||
                                                            id ===
                                                                "comfirm_password") &&
                                                        hidePassword
                                                    }
                                                    returnKeyType="next"
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
                                                {(id === "password" ||
                                                    id ===
                                                        "comfirm_password") && (
                                                    <Text
                                                        onPress={() =>
                                                            setHidePassword(
                                                                prev => !prev
                                                            )
                                                        }
                                                        className="absolute
                                                right-3 top-1/2 text-primary"
                                                    >
                                                        <Ionicons
                                                            size={16}
                                                            name={
                                                                hidePassword
                                                                    ? "eye"
                                                                    : "eye-off"
                                                            }
                                                        />
                                                    </Text>
                                                )}
                                                {errors[id]?.message && (
                                                    <Text
                                                        className="text-red-500
                                              text-xs italic px-6"
                                                    >
                                                        {!passwordMatch &&
                                                        id === "confirmpassword"
                                                            ? "Passwords don't match"
                                                            : errors[id]
                                                                  .message}
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    />
                                )
                        )
                    )}

                    <View className="flex flex-row items-center justify-between">
                        {!isLoginMode && isNext !== "email" && (
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
                        {!isLoginMode && isNext !== "cv" && (
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
                    <View
                        className="flex flex-row items-center space-x-4
                justify-center"
                    >
                        <Text className="font-medium capitalize text-body">
                            {isLoginMode
                                ? " no account"
                                : "already have an account ?"}
                        </Text>
                        <Text
                            onPress={handleSwitch}
                            className="text-primary capitalize font-semibold"
                        >
                            {isLoginMode ? " Sign up" : "login"}
                        </Text>
                    </View>

                    
                        <Text
                            className="px-4 py-4  rounded-full shadow
                           shadow-black shadow-lg bg-primary w-full text-center
                           capitalize font-semibold
                           text-white"
                            onPress={loading?null:handleSubmit(onSubmit)}
                        >
                            {isLoginMode ? "Login" : "Sign up"}
                        </Text>
                    
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
            <Modal
                className="flex-1 w-full h-full"
                animationType="fade"
                transparent={false}
                visible={pReset}
                onRequestClose={() => setPReset(false)}
            >
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
                {isVerified ? (
                    <View
                        className="flex-1 items-center justify-center px-2
                space-y-4"
                    >
                        <Text>
                            OTP will be sent to this email if authorized
                        </Text>
                        <TextInput
                            className="px-4 py-4  rounded-full shadow
                           shadow-black shadow-lg bg-card outline-2 w-full
                           text-body"
                            editable={true}
                            placeholderTextColor={"#53a65e"}
                            placeholder={"password"}
                            onChangeText={text =>
                                setPwd(prev => ({
                                    ...prev,
                                    ["password"]: text
                                }))
                            }
                            value={pwd.password}
                            inputMode={"text"}
                            spellcheck={false}
                        />
                        <TextInput
                            className="px-4 py-4  rounded-full shadow
                           shadow-black shadow-lg bg-card outline-2 w-full
                           text-body"
                            editable={true}
                            placeholderTextColor={"#53a65e"}
                            placeholder={"comfirm password"}
                            onChangeText={text =>
                                setPwd(prev => ({
                                    ...prev,
                                    ["cpassword"]: text
                                }))
                            }
                            value={pwd.cpassword}
                            inputMode={"text"}
                            spellcheck={false}
                        />
                        <Text
                            onPress={handleChangePwd}
                            className="text-white bg-primary rounded-full py-4
                        text-center 
                    px-4 capitalize w12"
                        >
                            reset password
                        </Text>
                    </View>
                ) : (
                    <View
                        className="flex-1 items-center justify-center px-2
                space-y-4"
                    >
                        <Text>
                            OTP will be sent to this email if authorized
                        </Text>
                        <TextInput
                            className="px-4 py-4  rounded-full shadow
                           shadow-black shadow-lg bg-card outline-2 w-full
                           text-body"
                            editable={true}
                            placeholderTextColor={"#53a65e"}
                            placeholder={isOtp ? "DD4RE3" : "example@email.com"}
                            onChangeText={text =>
                                isOtp ? setOtp(text) : setResetpwd(text)
                            }
                            value={isOtp ? otp : resetpwd}
                            inputMode={"text"}
                            spellcheck={false}
                        />
                        <Text
                            onPress={handleResetPwd}
                            className="text-white bg-primary rounded-full py-4
                        text-center 
                    px-4 capitalize w12"
                        >
                            {isOtp ? "verify otp" : "send otp"}
                        </Text>
                    </View>
                )}
            </Modal>
        </SafeAreaView>
    );
}
