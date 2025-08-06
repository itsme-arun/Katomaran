import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { db, auth } from "../services/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

const priorities = ["Low", "Medium", "High"];

export default function TaskFormScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Title is required.");
      return;
    }
    setLoading(true);

    const userId = auth.currentUser?.uid || "TEMP_USER_DEV";

    try {
      const taskData = {
        title,
        description,
        dueDate: format(dueDate, "yyyy-MM-dd"),
        priority,
        status: "pending",
        tag: "General",
        userId,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "tasks"), taskData);
      setLoading(false);

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate(new Date());

      navigation.goBack();
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to save task.");
      console.error("Error saving task:", error);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            editable={!loading}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            editable={!loading}
          />

          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            onPress={() => !loading && setShowDatePicker(true)}
          >
            <Text style={styles.dateInput}>
              {format(dueDate, "yyyy-MM-dd")}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.priorityButton,
                  priority === level && styles.priorityButtonActive,
                ]}
                onPress={() => !loading && setPriority(level)}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    priority === level && styles.priorityButtonTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Task</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#f9f9f9",
  },
  priorityContainer: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#2e6ef7",
    backgroundColor: "#f1f1f1",
    alignItems: "center",
  },
  priorityButtonActive: {
    backgroundColor: "#2e6ef7",
  },
  priorityButtonText: {
    color: "#2e6ef7",
    fontWeight: "600",
  },
  priorityButtonTextActive: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#2e6ef7",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
