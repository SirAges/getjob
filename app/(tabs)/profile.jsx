import Ionicons from "@expo/vector-icons/Ionicons";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
import * as DocumentPicker from "expo-document-picker";

import {
    View,
    Text,
    Image,
    ScrollView,
    TextInput,
    TouchableWithoutFeedback
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-simple-toast";

import { useAuth } from "../../hooks/useAuth";
import { generateOTP, diffDays } from "../../lib/utils";
import {
    useVerifyEmailMutation,
    useLogoutMutation
} from "../../redux/auth/authApiSlice";
import { useUpdateUserMutation } from "../../redux/user/userApiSlice";
export default function ProfileScreen() {
    const { user, id } = useAuth();

    const [loading, setLoading] = useState(false);
    const [u, setU] = useState(user);
    useEffect(() => {}, []);

    const [verifyToken, setVerifyToken] = useState(null);
    const [edit, setEdit] = useState({
        title: "",
        type: "text",
        key: "",
        value: ""
    });

    const [inputOtp, setInputOtp] = useState("");

    const [verifyEmail] = useVerifyEmailMutation();
    const [logout] = useLogoutMutation();

    const [updateUser] = useUpdateUserMutation();

    const pickDocument = async type => {
        const cloudName = "daxrp4nar";
        const apiKey = "868455186369275";
        const uploadPreset = "tlccrm";

        setEdit(prev => ({
            ...prev,
            key: "image",
            value: u.image,
            title: "Edit your Image"
        }));
        try {
            DocumentPicker?.getDocumentAsync({
                type
            })
                .then(async res => {
                    const { assets, canceled } = res;

                    if (canceled || !assets) {
                        Toast.show("Process canceled");
                    }

                    for (const asset of assets) {
                        setLoading(true);
                        const { name, mimeType, uri } = asset;

                        const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

                        const formData = new FormData();
                        formData.append("file", {
                            uri,
                            type: mimeType,
                            name: id + "_" + name
                        });

                        formData.append("upload_preset", uploadPreset);
                        formData.append("api_key", apiKey);

                        const options = {
                            method: "post",
                            body: formData,
                            headers: {
                                accept: "application/json"
                            }
                        };

                        const response = await fetch(apiUrl, options);

                        const data = await response.json();
                        const imageUri = data.secure_url;

                        if (imageUri) {
                            const data = await updateUser({
                                [edit?.key]: imageUri,
                                userId: id
                            });
                            setU(prev => ({ ...prev, [edit?.key]: imageUri }));

                            Toast.show(
                                data?.error ? data?.error?.data : data?.data
                            );
                            setLoading(false);
                        }
                    }
                })
                .catch(error => {
                    Toast.show(error.message);
                });
        } catch (error) {
            Toast.show(error.message);
        }
    };

    const handleVerify = async () => {
        setLoading(true);

        const otp = generateOTP(6);
        try {
            const data = await verifyEmail({ email: u.email, otp });
            const res = data?.error ? data?.error?.data : data?.data;

            setVerifyToken(res);

            Toast.show(
                data?.error
                    ? "An error occured unable to verify try again"
                    : "message sent successfully, check your email for otp"
            );
            setLoading(false);
        } catch (error) {
            Toast.show(error?.message);
            setLoading(false);
        }
    };

    const handleOtp = async () => {
        setLoading(true);
        const date = new Date().getTime();
        try {
            if (verifyToken) {
                const { exp, otp } = jwtDecode(verifyToken);

                const isExp = exp - date / 1000;

                if (otp === inputOtp && isExp > 0) {
                    const data = await updateUser({
                        verified: true,
                        userId: id
                    });
                    Toast.show(data?.error ? data?.error?.data : data?.data);
                    setInputOtp("");
                    setVerifyToken(null);
                    setLoading(false);
                } else if (otp !== inputOtp) {
                    setLoading(false);
                    Toast.show("Wrong OTP");
                } else {
                    Toast.show("OTP Token has ecpired send another");
                    setVerifyToken(null);
                    setInputOtp("");
                    setLoading(false);
                }
            }
        } catch (error) {
            Toast.show(error?.message);
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        setLoading(true);
        
        try {
            const data = await updateUser({
                [edit.key]: edit.value,
                userId: id
            });

            if (!data?.error) {
                setU(prev => ({ ...prev, [edit.key]: edit.value }));

                setEdit({ title: "", type: "text", key: "", value: "" });
            }
            Toast.show(data?.error ? data?.error?.data : data?.data);

            setLoading(false);
        } catch (error) {
            Toast.show(error?.message);
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);

        try {
            const data = await logout();

            if (!data?.error) {
                AsyncStorage.setItem("persist", JSON.stringify(false));
                Toast.show("you have successfully logged out");

                router.replace("/");
            }

            setLoading(false);
        } catch (error) {
            Toast.show(error?.message);
            setLoading(false);
        }
    };

    return (
        id && (
            <SafeAreaView
                className="flex-1
        bg-background"
            >
                <ScrollView>
                    <View
                        className="flex-1
        bg-background justify-center items-center space-y-4 py-4"
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
                        <TouchableWithoutFeedback
                            onLongPress={() =>
                                pickDocument([
                                    "image/png",
                                    "image/jpg",
                                    "image/jpeg"
                                ])
                            }
                        >
                            <View
                                className="relative w-full rounded-full w-36 h-36 p-2 bg-card
          "
                            >
                                <Image
                                    className="w-full w-full h-full rounded-full"
                                    style={{ resizeMode: "cover" }}
                                    source={{
                                        uri: u?.image
                                    }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <View className="flex-row items-center space-x-2">
                            <Text
                                onLongPress={() => {
                                    setEdit(prev => ({
                                        ...prev,
                                        key: "last_name",
                                        value: u.last_name,
                                        title: "Edit your last name",
                                        type: "text"
                                    }));
                                }}
                                className="text-md font-semibold text-title
            "
                            >
                                {u.last_name}
                            </Text>
                            <Text
                                onLongPress={() => {
                                    setEdit(prev => ({
                                        ...prev,
                                        key: "first_name",
                                        value: u.first_name,
                                        title: "Edit your first name",
                                        type: "text"
                                    }));
                                }}
                                className="text-md font-semibold text-title
            "
                            >
                                {u.first_name}
                            </Text>
                        </View>
                        <Text
                            onLongPress={() => {
                                setEdit(prev => ({
                                    ...prev,
                                    key: "email",
                                    value: u.email,
                                    title: "Edit your email",
                                    type: "text"
                                }));
                            }}
                            className="text-xs text-body"
                        >
                            {u.email}
                        </Text>
                        <Text
                            onLongPress={() => {
                                setEdit(prev => ({
                                    ...prev,
                                    key: "prefered_job",
                                    value: u.prefered_job,
                                    title: "Edit your prefered job",
                                    type: "text"
                                }));
                            }}
                            className="text-2xl font-semibold text-title"
                        >
                            {u.prefered_job}
                        </Text>
                        <Text className=" font-semibold text-title text-primary capitalize">
                            {u.role}
                        </Text>
                        <Link
                            onLongPress={() =>
                                pickDocument(["application/pdf"])
                            }
                            className="bg-card rounded-full px-3 py-2"
                            href={u.cv}
                        >
                            Download cv
                        </Link>

                        <View className="items-center flex-row ">
                            <Text className="font-semibold capitalize text-center text-xs">
                                Age:
                            </Text>
                            <Text
                                onLongPress={() => {
                                    setEdit(prev => ({
                                        ...prev,
                                        key: "age",
                                        value: u.age,
                                        title: "Edit your age",
                                        type: "numeric"
                                    }));
                                }}
                                className="capitalize text-xs"
                            >
                                {u.age}
                            </Text>
                        </View>
                        <View className="items-center flex-row space-x-2">
                            <Text className="font-semibold capitalize text-center text-xs">
                                Address:
                            </Text>
                            <Text
                                onLongPress={() => {
                                    setEdit(prev => ({
                                        ...prev,
                                        key: "address",
                                        value: u.address,
                                        title: "Edit your address",
                                        type: "text"
                                    }));
                                }}
                                className="capitalize text-xs"
                            >
                                {u.address}
                            </Text>
                            <Text
                                onLongPress={() => {
                                    setEdit(prev => ({
                                        ...prev,
                                        key: "city",
                                        value: u.city,
                                        title: "Edit your city",
                                        type: "text"
                                    }));
                                }}
                                className="capitalize text-xs"
                            >
                                {u.city}
                            </Text>
                            <Text
                                onLongPress={() => {
                                    setEdit(prev => ({
                                        ...prev,
                                        key: "state",
                                        value: u.state,
                                        title: "Edit your state",
                                        type: "text"
                                    }));
                                }}
                                className="capitalize text-xs"
                            >
                                {u.state}
                            </Text>
                        </View>
                        <View className="items-center flex-row space-x-2 ">
                            <Text className="font-semibold capitalize text-center text-xs">
                                Education:
                            </Text>
                            <Text
                                onLongPress={() => {
                                    setEdit(prev => ({
                                        ...prev,
                                        key: "degree",
                                        value: u.degree,
                                        title: "Edit your degree",
                                        type: "text"
                                    }));
                                }}
                                className="capitalize text-xs"
                            >
                                {u.degree}
                            </Text>
                            <Text
                                onLongPress={() => {
                                    setEdit(prev => ({
                                        ...prev,
                                        key: "course",
                                        value: u.course,
                                        title: "Edit your course",
                                        type: "text"
                                    }));
                                }}
                                className="capitalize text-xs"
                            >
                                {u.course}
                            </Text>
                        </View>
                        <Text
                            onPress={handleLogout}
                            className="text-danger font-semibold"
                        >
                            logout
                        </Text>

                        <View className="flex-row items-center space-x-3">
                            <Text
                                onPress={() =>
                                    router.push("https://wa.me/2348072921210")
                                }
                                className="text-green-500"
                            >
                                <Ionicons name="logo-whatsapp" size={44} />
                            </Text>
                            <Text
                                onPress={() =>
                                    router.push(
                                        "https://www.facebook.com/ekelestephendesign"
                                    )
                                }
                                className="text-blue-500"
                            >
                                <Ionicons name="logo-facebook" size={44} />
                            </Text>
                        </View>

                        {!u.verified && !verifyToken && (
                            <Text
                                onPress={handleVerify}
                                className="capitalize text-sm font-semibold text-title text-danger absolute top-10 left-10 "
                            >
                                click to verify your email
                            </Text>
                        )}

                        {verifyToken && (
                            <View
                                className=" w-full items-center
                            justify-center"
                            >
                                <Text className="font-semibold">
                                    OTP will expire in 2 minutes
                                </Text>
                                <TextInput
                                    className="px-3 py-2 space-x-2 rounded-full
                                    shadow 
                           shadow-black shadow-lg bg-card outline-2 w-3/5
                           text-body"
                                    onSubmitEditing={handleOtp}
                                    returnKeyType="send"
                                    editable={!loading}
                                    placeholderTextColor={"#0039fd88"}
                                    placeholder="Your One Time Password"
                                    onChangeText={text => setInputOtp(text)}
                                    value={inputOtp}
                                    inputMode={"text"}
                                    spellcheck={false}
                                />
                            </View>
                        )}

                        {edit.key !== "image" &&
                            edit.key !== "cv" &&
                            edit.key && (
                                <View
                                    className=" w-full items-center
                            justify-center"
                                >
                                    <Text className="font-semibold">
                                        {edit.title}
                                    </Text>
                                    <View
                                        className="w-4/5 items-center relative
                                    flex-row"
                                    >
                                        <TextInput
                                            className="px-3 py-2 rounded-full
                               w-full     shadow 
                           shadow-black shadow-lg bg-card outline-2 
                           text-body"
                                            onSubmitEditing={handleEdit}
                                            returnKeyType="send"
                                            editable={!loading}
                                            placeholderTextColor={"#0039fd88"}
                                            placeholder={edit.title}
                                            onChangeText={text =>
                                                setEdit(prev => ({
                                                    ...prev,
                                                    value: text
                                                }))
                                            }
                                            value={edit.value}
                                            inputMode={edit.type}
                                            spellcheck={false}
                                        />
                                        <Text
                                            onPress={() =>
                                                setEdit({
                                                    title: "",
                                                    type: "text",
                                                    key: "",
                                                    value: ""
                                                })
                                            }
                                            className="absolute right-2"
                                        >
                                            <Ionicons name="close" size={24} />
                                        </Text>
                                    </View>
                                </View>
                            )}

                        <Text
                            className={`capitalize text-sm font-semibold text-title ${
                                diffDays(u.subscribed, 30)
                                    ? "text-primary"
                                    : "text-danger"
                            }
            absolute top-10 right-10 `}
                        >
                            {diffDays(u.subscribed, 30) ? "paid" : "free"}
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    );
}
