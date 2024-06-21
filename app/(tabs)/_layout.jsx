import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default  function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "#53a65e" }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: "Home",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            size={24}
                            name={focused ? "home" : "home-outline"}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    headerShown: false,
                    title: "Search",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            size={24}
                            name={focused ? "search" : "search-outline"}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="blog"
                options={{
                    headerShown: false,
                    title: "Blog",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            size={24}
                            name={focused ? "newspaper" : "newspaper-outline"}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: "profile",
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            size={24}
                            name={focused ? "person" : "person-outline"}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="[job]"
                options={{
                    headerShown: false,
                    href: null
                }}
            />
        </Tabs>
    );
}
