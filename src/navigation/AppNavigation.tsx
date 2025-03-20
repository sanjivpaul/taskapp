import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home/Home";
import Login from "../screens/login/Login";
import SignUp from "../screens/signup/SignUp";
import { useDispatch, useSelector } from "react-redux";
import TaskDetailScreen from "../screens/home/TaskDetailScreen";
import TaskCreateScreen from "../screens/home/TaskCreateScreen";
import { setUserData } from "@/redux/features/auth/AuthSlice";
import AntDesign from "@expo/vector-icons/AntDesign";

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.auth?.userData);
  // console.log("userData", userData);

  const [isLoggedIn, setisLoggedIn] = useState(false);

  return (
    <Stack.Navigator>
      {userData ? (
        <>
          <Stack.Screen
            name="HomeScreen"
            component={Home}
            options={{
              headerTitle: "Tasks",
              headerTitleAlign: "center",
              headerLeft: () => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      // backgroundColor: "teal",
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginRight: 5,

                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 0.5,
                      borderColor: "grey",
                    }}
                  >
                    <AntDesign name="user" size={22} color="black" />
                  </View>
                  <Text>{userData?.user?.username}</Text>
                </View>
              ),
              headerRight: () => (
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPressIn={() => {
                    Alert.alert("Success", "Logout successfull!");
                    dispatch(setUserData(null));
                  }}
                >
                  <Text style={{ color: "tomato" }}>Logout</Text>
                  {/* <AntDesign name="logout" size={22} color="tomato" /> */}
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="TaskDetailScreen"
            component={TaskDetailScreen}
            options={{
              headerTitle: "Tasks Details",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="TaskCreateScreen"
            component={TaskCreateScreen}
            options={{
              // headerTitle: "Add Task",
              // headerTitleAlign: "center",
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
