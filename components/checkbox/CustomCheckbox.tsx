import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CustomCheckboxProps {
  checked: boolean;
  onToggle: () => void; // Event handler for toggling
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onToggle,
}) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
      <View
        style={[
          styles.checkbox,
          checked && styles.checked, // Add checked style
        ]}
      >
        {checked && <View style={styles.checkmark} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#4CAF50", // Green border
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Transparent background when unchecked
  },
  checked: {
    backgroundColor: "#4CAF50", // Green background when checked
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: "#fff", // White checkmark
    borderRadius: 2,
  },
});

export default CustomCheckbox;
