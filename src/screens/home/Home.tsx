import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import axios from "axios";
import { serverAddress } from "@/constants/ServerAddress";
import CustomCheckbox from "@/components/checkbox/CustomCheckbox"; // Assuming CustomCheckbox is imported from components

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  isCompleted: boolean;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = async () => {
    try {
      const response = await axios.get(`${serverAddress}/tasks`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 201) {
        setTasks(response.data.data);
      } else {
        Alert.alert(
          "Error",
          response?.data?.message || "Failed to fetch tasks"
        );
      }
    } catch (error) {
      console.log("Get Tasks Error:", error);
      Alert.alert("Error", "Failed to fetch tasks");
    }
  };

  const taskStatusUpdate = async (id: any) => {
    try {
      const response = await axios.put(
        `${serverAddress}/tasks/${id}`,
        {
          status: "done",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("update resp===>", response);
    } catch (error) {
      console.log("Update Status Error:", error);
      Alert.alert("Error", "Failed to update tasks");
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const handleCardPress = (taskId: string) => {
    console.log("Task card clicked, taskId: ", taskId);

    Alert.alert("Task Details", `Opening details for task ID: ${taskId}`);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <TouchableOpacity
          key={task._id}
          style={styles.cardContainer}
          onPress={() => handleCardPress(task._id)}
        >
          <View style={styles.taskCard}>
            {/* Checkbox for task completion */}
            <CustomCheckbox
              checked={task.isCompleted}
              onToggle={() => {
                toggleTaskCompletion(task._id); // Toggle completion status
                // e.stopPropagation(); // Prevent event bubbling to card click
                taskStatusUpdate(task._id);
              }}
            />

            <View style={{ flexDirection: "column" }}>
              <Text
                style={[
                  styles.taskText,
                  task.isCompleted && styles.completedText,
                ]}
              >
                {task.title}
              </Text>
              <Text
                style={[
                  styles.descText,
                  task.isCompleted && styles.completedText,
                ]}
              >
                {task.description}
              </Text>
              <Text>{task.status}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardContainer: {
    marginBottom: 10,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  descText: {
    fontSize: 14,
    marginLeft: 10,
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
});

export default Home;
