
import {
    View,
    Text,
    
} from "react-native";


export default function Highlight({ handleInput, watch, id, list, label }) {
    

    return (
        <View
            className="w-full
                    px-4 pb-3"
        >
            <Text
                className="capitalize text-md
                                        font-semibold text-title py-2
                            "
            >
                {label}
            </Text>
            <View
                className="flex-row
                                    items-center   flex-wrap gap-2
                  "
            >
                {list.map((e,i) => (
                    <Text
                    key={i}
                        className={`text-center
                                grow                                  bg-card
                                                                  rounded-md
                                                                  px-2 py-2
                                                                  uppercase
                                                     font-medium
                                                     text-xs
                                                     ${
                                                         watch(id) === e
                                                             ? "bg-primary text-white"
                                                             : "bg-card"
                                                     }`}
                    
                        onPress={() => handleInput(id, e)}
                    >
                        {e}
                    </Text>
                ))}
            </View>
        </View>
    );
}
