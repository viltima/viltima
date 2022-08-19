import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Message, RoomMessage, Rooms, Users } from "ui";

import {
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";

import { Colors, Inter } from "common";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import useAppState from "hooks/useAppState";
import { scale } from "react-native-size-matters";

const HomeTabs = () => {
  const { theme, signOut } = useAppState();
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: ({ tintColor }) => (
          <MaterialIcons
            onPress={() => signOut()}
            name="logout"
            size={24}
            style={{ marginRight: scale(15) }}
            color={tintColor}
          />
        ),
        tabBarShowLabel: false,
        headerTintColor: theme?.TextColor,
        tabBarStyle: {
          backgroundColor: Colors.Olive,
        },
        headerShadowVisible: false,
        headerTitle: "",
        headerTitleStyle: {
          fontFamily: Inter.Regular,
        },
        headerStyle: {
          backgroundColor: theme?.MiddleColor,
        },
      }}
    >
      <Tab.Screen
        name="Main"
        options={({ route }) => ({
          headerTitle: "",
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={24}
              color={focused ? Colors.White : Colors.Black}
            />
          ),
        })}
        component={Home}
      />

      <Tab.Screen
        options={{
          headerTitle: "Users",
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="chat"
              size={24}
              color={focused ? Colors.White : Colors.Black}
            />
          ),
        }}
        name="Users"
        component={Users}
      />

      <Tab.Screen
        options={{
          headerTitle: "Rooms",
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="door-open"
              size={24}
              color={focused ? Colors.White : Colors.Black}
            />
          ),
        }}
        name="Rooms"
        component={Rooms}
      />
    </Tab.Navigator>
  );
};

export const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeTabs} />
      <Stack.Screen
        options={({ route }) => ({
          headerTintColor: Colors.White,
          headerTitle: route?.params?.title || "Chat",
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.Olive,
          },
        })}
        name="Message"
        component={Message}
      />

      <Stack.Screen
        options={({ route }) => ({
          headerTintColor: Colors.White,
          headerShadowVisible: false,
          headerTitle: route?.params?.title || "Room Chat",
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.Olive,
          },
        })}
        name="RoomMessage"
        component={RoomMessage}
      />
    </Stack.Navigator>
  );
};
