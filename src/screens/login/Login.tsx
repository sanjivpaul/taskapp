import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/redux/features/auth/AuthSlice";

// types/navigation.ts
export type RootStackParamList = {
  HomeScreen: undefined;
  Login: undefined;
  Signup: undefined; // Add any parameters you expect to pass to this screen here
};

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.auth?.userData);
  console.log("userData", userData);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  console.log("email", email);
  console.log("password", password);

  const userLogin = async () => {
    setIsLoading(true);
    if (!password) {
      Alert.alert("Error:", "Password is required");
      return;
    }
    try {
      const response = await axios.post(
        "http://192.168.1.6:3000/auth/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login resp===>", response);
      if (response?.status == 200) {
        dispatch(setUserData(response?.data));
        setIsLoading(false);
        Alert.alert("Success", response?.data?.message);
      } else {
        Alert.alert("Success", response?.data?.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Login Error:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 22, marginVertical: 15 }}>
        Login to your account
      </Text>
      <View style={styles.inputFields}>
        <TextInput placeholder="Email" onChangeText={(val) => setEmail(val)} />
      </View>
      <View style={styles.inputFields}>
        <TextInput
          placeholder="password"
          onChangeText={(val) => setPassword(val)}
        />
      </View>
      <TouchableOpacity
        style={styles.buttonLogin}
        onPress={() => {
          console.log("Hit");

          userLogin();
        }}
      >
        {isLoading ? (
          <ActivityIndicator size={"small"} color={"#FFFFFF"} />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Signup");
        }}
      >
        <Text>Dont have an account, Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  inputFields: {
    backgroundColor: "#dddddd",
    width: "90%",
    borderRadius: 7,
    padding: 5,
    marginVertical: 5,
  },
  buttonLogin: {
    width: "70%",
    backgroundColor: "teal",
    padding: 10,
    borderRadius: 7,
    marginTop: 15,
  },
  loginButtonText: {
    alignSelf: "center",
    fontWeight: "500",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
