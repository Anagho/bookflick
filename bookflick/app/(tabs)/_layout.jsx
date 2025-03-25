import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import COLORS from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.tabPrimary,
        tabBarInactiveTintColor: COLORS.tabPrimary,
        tabBarPressColor: "transparent",
        tabBarPressOpacity: 1,
        headerTitleStyle: {
            color: COLORS.textPrimary,
            fontWeight: "600"
        },
        headerShadowVisible: false,
        tabBarStyle: {
            backgroundColor: COLORS.cardBackground,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingTop: 5,
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({focused, color, size }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "notifications",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "notifications" : "notifications-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "more",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
