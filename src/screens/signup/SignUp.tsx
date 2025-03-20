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
import { serverAddress } from "@/constants/ServerAddress";

// types/navigation.ts
export type RootStackParamList = {
  HomeScreen: undefined;
  Login: undefined;
  Signup: undefined; // Add any parameters you expect to pass to this screen here
};

const Signup = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const userSignup = async () => {
    setIsLoading(true);

    if (!fullName || !email || !username || !password) {
      Alert.alert("Error", "All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${serverAddress}auth/signup`,
        {
          fullName: fullName,
          email: email,
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Signup resp===>", response);
      if (response?.status === 201) {
        Alert.alert("Success", response?.data?.message);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", response?.data?.message);
      }
    } catch (error) {
      setIsLoading(false);
      // console.log("Signup Error:", error);
      if (error.response) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "An error occurred while signing up"
        );
      } else {
        Alert.alert("Error", "Network error or server is down");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 22, marginVertical: 15 }}>
        Create a new account
      </Text>

      {/* Full Name Input */}
      <View style={styles.inputFields}>
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={(val) => setFullName(val)}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputFields}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
      </View>

      {/* Username Input */}
      <View style={styles.inputFields}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(val) => setUsername(val)}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputFields}>
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
      </View>

      {/* Signup Button */}
      <TouchableOpacity
        style={styles.buttonSignup}
        onPress={() => {
          userSignup();
        }}
      >
        {isLoading ? (
          <ActivityIndicator size={"small"} color={"#FFFFFF"} />
        ) : (
          <Text style={styles.signupButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Navigate to Login Screen */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonSignup: {
    width: "70%",
    backgroundColor: "#0D92F4",
    padding: 10,
    borderRadius: 7,
    marginTop: 15,
  },
  signupButtonText: {
    alignSelf: "center",
    fontWeight: "500",
    fontSize: 18,
    color: "#FFFFFF",
  },
});
