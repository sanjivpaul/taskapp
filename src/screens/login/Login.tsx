import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 22, marginVertical: 15 }}>
        Login to your account
      </Text>
      <View style={styles.inputFields}>
        <TextInput placeholder="Email" />
      </View>
      <View style={styles.inputFields}>
        <TextInput placeholder="password" />
      </View>
      <TouchableOpacity style={styles.buttonLogin} onPress={() => {}}>
        <Text style={styles.loginButtonText}>Login</Text>
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
