import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    View,
    Text,
    
    TouchableWithoutFeedback,
    
} from "react-native";


export default function Select({
    setValue,
    watch,
    id,
    label,
    idx,
    setIdx,
    setSelect,
    select,
    selectList,
    setSelectList,
    list
}) {
    
    const handleSelect = () => {
        setIdx(id);
        setSelectList(list.sort());
        setSelect(true);
    };

    return (
        <TouchableWithoutFeedback onPress={handleSelect}>
            <View
                className="px-4 py-5 rounded-full shadow
                           shadow-black shadow-lg bg-card outline-2 flex-row
                           justify-between  w-full my-4"
            >
                <Text
                    className=" 
                           text-body"
                >
                    {watch(id) ? watch(id) : `Select ${label}`}
                </Text>
                <Text className="text-primary">
                    <FontAwesome name="caret-down" size={24} />
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
}
