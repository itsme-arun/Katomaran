import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function TaskCard({ task, onDelete, onToggleComplete }) {
  const isCompleted = task.status?.toLowerCase() === "completed";

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      <Text
        style={[styles.title, isCompleted && styles.completedTitle]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {task.title || "Untitled"}
      </Text>
      <Text style={styles.desc} numberOfLines={2} ellipsizeMode="tail">
        {task.description || "No description"}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>📅 Due: {task.dueDate || "N/A"}</Text>
        <Text style={styles.meta}>🔥 Priority: {task.priority || "Medium"}</Text>
      </View>
      <Text style={styles.meta}>📌 Status: {task.status || "pending"}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onToggleComplete(task.id, isCompleted)}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <FontAwesome
            name={isCompleted ? "undo" : "check-circle"}
            size={20}
            color={isCompleted ? "#ffc107" : "#28a745"}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.complete, isCompleted && styles.undo]}>
            {isCompleted ? "Undo" : "Complete"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(task.id)}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <FontAwesome name="trash" size={20} color="#d32f2f" style={{ marginRight: 6 }} />
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  completedCard: {
    backgroundColor: "#e6f4ea",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e6ef7",
    marginBottom: 6,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#2f7a32",
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: "#777",
    flexShrink: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  complete: {
    color: "#28a745", // Green for complete
    fontWeight: "bold",
    fontSize: 15,
  },
  undo: {
    color: "#ffc107", // Amber for undo
  },
  delete: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 15,
  },
});
