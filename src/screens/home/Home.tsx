import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { serverAddress } from "@/constants/ServerAddress";
import CustomCheckbox from "@/components/checkbox/CustomCheckbox"; // Assuming CustomCheckbox is imported from components
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/redux/features/auth/AuthSlice";
import Feather from "@expo/vector-icons/Feather";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  isCompleted: boolean;
}

const data = [
  {
    _id: "67d32d28050451ec010f0ecf",
    title: "Testing task 2",
    description: "Testing desc",
    status: "done",
    priority: "low",
    due_date: "March",
    createdAt: "2025-03-13T19:08:24.218Z",
    updatedAt: "2025-03-17T17:13:16.603Z",
    __v: 0,
  },
  {
    _id: "67d43f9d0745224196840622",
    title: "Testing with debu",
    description: "Show debu how api is works in node js",
    status: "done",
    priority: "low",
    due_date: "14/03/2025",
    createdAt: "2025-03-14T14:39:25.635Z",
    updatedAt: "2025-03-17T10:29:36.795Z",
    __v: 0,
  },
  {
    _id: "67d7ed2bccd052b3cf8996c8",
    title: "Testing task update",
    description: "Testing desc bhi update",
    status: "done",
    priority: "low",
    due_date: "March",
    createdAt: "2025-03-17T09:36:43.893Z",
    updatedAt: "2025-03-17T10:28:23.834Z",
    __v: 0,
  },
  {
    _id: "67d7fcbfccd052b3cf8996e5",
    title: "Api Integration 2",
    description: "Show debu how api is works in node js",
    status: "done",
    priority: "low",
    due_date: "14/03/2025",
    createdAt: "2025-03-17T10:43:11.936Z",
    updatedAt: "2025-03-17T17:03:12.019Z",
    __v: 0,
  },
  {
    _id: "67d7fcc6ccd052b3cf8996e7",
    title: "Api Integration 3",
    description: "Show debu how api is works in node js",
    status: "done",
    priority: "low",
    due_date: "14/03/2025",
    createdAt: "2025-03-17T10:43:18.130Z",
    updatedAt: "2025-03-17T17:25:30.139Z",
    __v: 0,
  },
  {
    _id: "67d85a88ccd052b3cf899711",
    title: "Api Integration 3",
    description: "Show debu how api is works in node js",
    status: "done",
    priority: "low",
    due_date: "14/03/2025",
    createdAt: "2025-03-17T17:23:20.767Z",
    updatedAt: "2025-03-17T17:24:27.794Z",
    __v: 0,
  },
  {
    _id: "67d85a8cccd052b3cf899713",
    title: "Api Integration 4",
    description: "Show debu how api is works in node js",
    status: "pending",
    priority: "low",
    due_date: "14/03/2025",
    createdAt: "2025-03-17T17:23:24.363Z",
    updatedAt: "2025-03-17T17:23:24.363Z",
    __v: 0,
  },
  {
    _id: "67d85a90ccd052b3cf899715",
    title: "Api Integration 5",
    description: "Show debu how api is works in node js",
    status: "pending",
    priority: "low",
    due_date: "14/03/2025",
    createdAt: "2025-03-17T17:23:28.457Z",
    updatedAt: "2025-03-17T17:23:28.457Z",
    __v: 0,
  },
];

const { height, width } = Dimensions.get("window");

const Home: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.auth?.userData);
  const accessToken = userData?.accessToken;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getTasks = async () => {
    try {
      const response = await axios.get(`${serverAddress}tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
      if (error.response) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to fetch tasks"
        );
      } else {
        Alert.alert("Error", "Failed to fetch tasks");
      }
    }
  };

  const taskStatusUpdate = async (id: any) => {
    try {
      const response = await axios.put(
        `${serverAddress}tasks/${id}`,
        {
          status: "completed",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // console.log("update resp===>", response);
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
    navigation.navigate("TaskDetailScreen", { taskId });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getTasks();
    setRefreshing(false);
  };

  // useEffect(() => {
  //   getTasks();
  // }, [refresh]);

  useFocusEffect(
    React.useCallback(() => {
      getTasks(); // Get tasks when the screen is focused
    }, [refresh])
  );

  const formattedDate = (date: any) => {
    const options = { day: "2-digit", month: "long" };
    const dateObj = new Date(date.split("/").reverse().join("-"));
    return dateObj.toLocaleDateString("en-GB", options);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={tasks}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: Task }) => (
            <TouchableOpacity
              key={item._id}
              style={styles.cardContainer}
              onPress={() => handleCardPress(item._id)}
            >
              <View style={styles.taskCard}>
                <CustomCheckbox
                  checked={item.status === "completed"}
                  onToggle={() => {
                    toggleTaskCompletion(item._id);
                    taskStatusUpdate(item._id);
                    setRefresh(!refresh);
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "90%",
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={[
                        styles.taskText,
                        item.status === "completed" && styles.completedText,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.descText,
                        item.status === "completed" && styles.completedText,
                      ]}
                    >
                      {item.description}
                    </Text>
                    {/* <Text>{item.status}</Text> */}
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    {/* <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        borderStyle: "dashed",
                        borderWidth: 1,
                        borderColor: "grey",

                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <Feather name="calendar" size={18} color="black" />
                    </View> */}
                    <View>
                      <Text
                        style={{
                          fontWeight: "500",
                          fontSize: 13,
                          textAlign: "right",
                        }}
                      >
                        Due Date
                      </Text>
                      <Text style={{ fontSize: 12, textAlign: "right" }}>
                        {formattedDate(item.due_date)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          borderColor:
                            item.status == "completed" ? "green" : "orange",
                          borderWidth: 1,
                          borderRadius: 10,
                          paddingHorizontal: 7,
                          alignSelf: "center",
                          marginTop: 5,
                        }}
                      >
                        {item.status == "completed" ? "Done" : "In Progress"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: height / 20,
          alignSelf: "flex-end",
          right: height / 35,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("TaskCreateScreen");
          }}
          style={{
            backgroundColor: "#4CAF50",
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            elevation: 10,
          }}
        >
          <FontAwesome6 name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
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
    // elevation: 2,
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
    fontWeight: "500",
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  logoutText: {
    fontSize: 16,
    color: "tomato",
  },
});

export default Home;
