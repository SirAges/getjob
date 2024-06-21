import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    Alert
} from "react-native";
import * as Progress from "react-native-progress";
import Toast from "react-native-simple-toast";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
export default function FilePicker({ setValue, watch, id, type, label }) {
    const [loading, setLoading] = useState(false);
    const pickDocument = async () => {
        const cloudName = "daxrp4nar";
        const apiKey = "868455186369275";
        const uploadPreset = "tlccrm";
        const { assets } = await DocumentPicker.getDocumentAsync({
            type
        });

        if (!assets) {
            Alert.alert("error", "failed to pick document");
        }
        for (const asset of assets) {
            try {
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
                    setValue(id, imageUri);
                    setLoading(false);
                }
            } catch (error) {
                Toast.show(error.message);
                setLoading(false);
            }
        }
    };
    const pdfname = watch(id)?.split("/")?.pop();
    return loading ? (
        <View className=" w-full items-center">
            <Progress.Circle
                size={30}
                indeterminate={true}
                borderWidth={2}
                showsText={true}
                useNativeDriver={true}
            />
        </View>
    ) : (
        <TouchableWithoutFeedback onPress={pickDocument}>
            <View className="w-full">
                <Text
                    className="capitalize text-md
                                        font-semibold text-title py-2
                            "
                >
                    {label}
                </Text>
                {id === "cv" ? (
                    <Text
                        className="px-4 py-4  rounded-full shadow
                           shadow-black shadow-lg bg-card outline-2 w-full
                           text-body"
                    >
                        {pdfname ? pdfname : "Select a default cv"}
                    </Text>
                ) : id !== "image" || id !== "job_company_logo" ? (
                    <View
                        className="relative  py-3  p-2 shadow my-2
                           shadow-black shadow-lg bg-card outline-2 w-full h-52"
                    >
                        <Image
                            className=" w-full h-full"
                            style={{ resizeMode: "cover" }}
                            source={
                                watch(id)
                                    ? { uri: watch(id) }
                                    : require("../assets/images/upload.png")
                            }
                        />
                    </View>
                ) : (
                    <View
                        className="relative  py-3 rounded-full p-2 shadow my-2
                           shadow-black shadow-lg bg-card outline-2 
                           "
                    >
                        <Image
                            className="rounded-full w-24 h-24"
                            style={{ resizeMode: "cover" }}
                            source={
                                watch(id)
                                    ? { uri: watch(id) }
                                    : require("../assets/images/find.jpg")
                            }
                        />
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}
