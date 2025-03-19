import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home/Home";
import Login from "../screens/login/Login";
import SignUp from "../screens/signup/SignUp";
import { useSelector } from "react-redux";
import TaskDetailScreen from "../screens/home/TaskDetailScreen";
import TaskCreateScreen from "../screens/home/TaskCreateScreen";

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  const userData = useSelector((state: any) => state.auth?.userData);
  console.log("userData", userData);

  const [isLoggedIn, setisLoggedIn] = useState(false);

  return (
    <Stack.Navigator>
      {Object.keys(userData)?.length > 0 ? (
        <>
          <Stack.Screen
            name="HomeScreen"
            component={Home}
            options={{ headerTitle: "Tasks", headerTitleAlign: "center" }}
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
              headerTitle: "Add Task",
              headerTitleAlign: "center",
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
