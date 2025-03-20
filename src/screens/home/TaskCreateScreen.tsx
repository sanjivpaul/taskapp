import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import the Picker
import axios from "axios";
import { serverAddress } from "@/constants/ServerAddress"; // Make sure this is correctly set up
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";

const TaskCreateScreen = ({ navigation }: { navigation: any }) => {
  const userData = useSelector((state: any) => state.auth?.userData);
  const refreshToken = userData?.refreshToken;
  const accessToken = userData?.accessToken;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false); // State to show/hide DatePicker

  // Format date as MM/DD/YYYY (You can change this format if needed)
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCreateTask = async () => {
    if (!title || !description || !dueDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${serverAddress}tasks`,
        {
          title,
          description,
          status,
          priority,
          due_date: dueDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Task created successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      Alert.alert("Error", "Failed to create task");
    }
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setDueDate(formatDate(currentDate)); // Format the date and set it to the dueDate state
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Task</Text>

      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Task Description"
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
      />

      {/* Dropdown for Status */}
      {/* <Text style={styles.dropdownLabel}>Status</Text> */}
      {/* <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Pending" value="pending" />
        <Picker.Item label="In Progress" value="inprogress" />
        <Picker.Item label="Done" value="done" />
      </Picker> */}

      {/* Dropdown for Priority */}
      {/* <Text style={styles.dropdownLabel}>Priority</Text> */}
      <Picker
        selectedValue={priority}
        onValueChange={(itemValue) => setPriority(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Low" value="low" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="High" value="high" />
      </Picker>

      {/* <TextInput
        style={styles.input}
        placeholder="Due Date (e.g., March 14, 2025)"
        value={dueDate}
        onChangeText={setDueDate}
      /> */}

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={[styles.input, { justifyContent: "center" }]}
      >
        <Text style={{}}>{dueDate ? dueDate : "Select Due Date"}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
        <Text style={styles.buttonText}>Create Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 60,
    borderColor: "#ddd",
    // borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  picker: {
    height: 60,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TaskCreateScreen;
