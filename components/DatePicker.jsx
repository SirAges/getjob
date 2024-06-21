import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState, useRef } from "react";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { formatDateTime } from "../lib/utils";
import { View, Text } from "react-native";

export default function DatePicker({ setValue, watch, id, type, label }) {
    
    const date = useRef(new Date());
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const showDatePicker = () => {
        setDatePickerVisible(prev => !prev);
    };
    const hideDatePicker = () => {
        setDatePickerVisible(prev => !prev);
    };
    const handleConfirm = async d => {
        if (d || d !== undefined || d !== null) {
            setValue(id, d);
        }
        hideDatePicker();
    };
    return (
        <View
            className="px-4 py-4  rounded-full shadow
                           shadow-black shadow-lg bg-card outline-2 w-full
                           text-body flex-row items-center space-x-2"
        >
            <Text className="text-primary" onPress={showDatePicker}>
                <Ionicons name="calendar-outline" size={24} />
            </Text>

            <Text>{watch(id) ? formatDateTime(watch(id)) : "pick dealine date"}</Text>
            <DateTimePickerModal
                date={date.current}
                isVisible={datePickerVisible}
                mode="datetime"
                is24Hour
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
}
