import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Button,
} from "react-native";
import axios from "axios";
import { serverAddress } from "@/constants/ServerAddress";
import { useRoute, useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker"; // Import react-native-picker
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  createdAt: string;
  updatedAt: string;
}

const TaskDetailScreen: React.FC = () => {
  const userData = useSelector((state: any) => state.auth?.userData);
  const refreshToken = userData?.refreshToken;
  const accessToken = userData?.accessToken;
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const route = useRoute();
  const navigation = useNavigation();

  const { taskId } = route.params as { taskId: string };

  // Fetch task details
  const getTaskDetails = async () => {
    try {
      const response = await axios.get(`${serverAddress}tasks/${taskId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response?.status === 201) {
        setTask(response.data.data);
        setPriority(response.data.data.priority);
        setStatus(response.data.data.status); // Initialize the status
        setDueDate(response.data.data.due_date); // Initialize the due date
      } else {
        Alert.alert("Error", "Failed to fetch task details");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch task details");
    }
  };

  useEffect(() => {
    getTaskDetails();
  }, []);

  // Handle task update
  const updateTask = async () => {
    try {
      const updatedTask = {
        ...task,
        priority,
        status,
        due_date: dueDate, // Update due date too
      };

      setIsLoading(true);
      const response = await axios.put(
        `${serverAddress}tasks/${taskId}`,
        updatedTask,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response?.status === 201) {
        Alert.alert("Success", "Task updated successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update task");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task deletion
  const deleteTask = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${serverAddress}tasks/${taskId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response?.status === 201) {
        Alert.alert("Success", "Task deleted successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to delete task");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  const formattedCreatedAt = new Date(task?.createdAt || "").toLocaleString();

  if (!task) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setDueDate(formatDate(currentDate)); // Format the date and set it to the dueDate state
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{task.title}</Text>

        {/* Description */}
        <View style={styles.card}>
          <View style={styles.row}>
            {/* <MaterialIcons name="description" size={24} color="black" /> */}
            <TextInput
              style={[styles.input, { height: 70 }]}
              value={task.description}
              multiline
              editable={false}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Priority Dropdown */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Octicons name="checklist" size={24} color="black" />
            <Text style={styles.cardText}>Priority</Text>
          </View>
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Low" value="low" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="High" value="high" />
          </Picker>
        </View>

        {/* Status Dropdown */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Octicons name="git-pull-request-draft" size={24} color="black" />
            <Text style={styles.cardText}>Status</Text>
          </View>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Not Started" value="notstarted" />
            <Picker.Item label="In Progress" value="inprogress" />
            <Picker.Item label="Completed" value="completed" />
          </Picker>
        </View>

        {/* Due Date */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.row}
          >
            <Feather name="calendar" size={24} color="black" />
            <Text style={styles.cardText}>
              Due Date: {dueDate || "Select Due Date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Update and Delete Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={updateTask}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Update Task</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={deleteTask}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.createdAt}>Created At: {formattedCreatedAt}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#f5f5f5",
  },
  cardText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  picker: {
    height: 50,
    width: "100%",
    marginTop: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF5733",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  createdAt: {
    fontSize: 14,
    color: "#777",
  },
});

export default TaskDetailScreen;
