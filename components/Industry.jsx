import Ionicons from "@expo/vector-icons/Ionicons";
import {
    View,
    Text,
    
    ScrollView
} from "react-native";

import { useState } from "react";
import { Link } from "expo-router";
export default function Industry({  industries }) {
    const [dropdown, setDropdown] = useState(null);
    const [list, setList] = useState([]);

    const handleDropdown = (clicked, value) => {
        if (dropdown === clicked) {
            setDropdown(null);
        } else {
            setDropdown(clicked);
            setList(value);
        }
    };

    return (
        <View
            className="
        px-3 py-4"
        >
            <Text className="font-semibold capitalize text-lg">Industry</Text>
            <ScrollView
                horizontal
                className="
         py-2"
            >
                <View className="flex-row items-center space-x-2 px-4">
                    {Object.entries(industries)
                        .sort()
                        .map(([key, value], i) => (
                            <Text
                                onPress={() => handleDropdown(key, value)}
                                key={key}
                                className="bg-card rounded-md p-2 p-2 text-title
}                    "
                            >
                                {key}
                            </Text>
                        ))}
                </View>
            </ScrollView>
            {dropdown && (
                <ScrollView className="max-h-60">
                    <View className="flex-1">
                        <View className="flex-row  w-full justify-end px-4">
                            <Ionicons
                                onPress={() => setDropdown(false)}
                                name="close"
                                size={24}
                            />
                        </View>
                        <View className="flex-row flex-wrap gap-2 ">
                            {list.sort().map(l => (
                                <Link
                              push
                                    href={`/search?searchparams=${l}`}
                                    key={l}
                                    className="bg-card rounded-md
                py-2 px-2 text-title"
                                >
                                    {l}
                                </Link>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}
