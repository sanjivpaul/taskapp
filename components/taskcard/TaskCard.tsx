import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomCheckbox from "../checkbox/CustomCheckbox";
import { useState } from "react";

const TaskCard = ({ task, onToggleComplete, onCardPress }) => {
  const [checked, setChecked] = useState(task.isCompleted);

  const handleCheckboxToggle = (e) => {
    setChecked(!checked); // Toggle the checkbox state
    onToggleComplete(task._id); // Call the onToggleComplete function to toggle task completion
    e.stopPropagation(); // Prevent this event from propagating to the card press handler
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onCardPress(task._id)} // Handle task card press (for opening task details)
    >
      <View style={styles.taskCard}>
        <CustomCheckbox checked={checked} onToggle={handleCheckboxToggle} />
        <View style={{ flexDirection: "column" }}>
          <Text style={[styles.taskText, checked && styles.completedText]}>
            {task.title}
          </Text>
          <Text style={[styles.descText, checked && styles.completedText]}>
            {task.description}
          </Text>
          <Text>{task.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
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
