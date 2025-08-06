import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { db, auth } from "../services/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import TaskCard from "../components/TaskCard";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HomeScreen() {
  const [allTasks, setAllTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const user = auth.currentUser;

  const today = new Date();
  const todayIndex = today.getDay();
  const todayDate = String(today.getDate()).padStart(2, "0");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAllTasks();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid || "TEMP_USER_DEV";
      const q = query(collection(db, "tasks"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllTasks(fetched);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      fetchAllTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleComplete = async (id, isCompleted) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, {
        status: isCompleted ? "pending" : "completed",
      });
      fetchAllTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const visibleTasks = allTasks.filter((task) => {
    const matchesStatus =
      filterStatus === "All"
        ? true
        : task.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      searchQuery.trim().length === 0
        ? true
        : (task.title || "")
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()) ||
          (task.description || "")
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const calculateCompletion = () => {
    const total = allTasks.length;
    const completed = allTasks.filter(
      (task) => task.status?.toLowerCase() === "completed"
    ).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.hello}>Hello</Text>
            <Text style={styles.name}>
              {user?.displayName ? user.displayName : "User"}
            </Text>
          </View>
          <Image
            source={{
              uri:
                user?.photoURL || "https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg",
            }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.searchBox}>
          <FontAwesome
            name="search"
            size={20}
            color="#999"
            style={{ marginRight: 10 }}
          />
          <TextInput
            placeholder="Search Task"
            placeholderTextColor="#aaa"
            style={{ flex: 1 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={true}
          />
          <Feather name="bell" size={20} color="#999" />
        </View>

        <View style={styles.dayBar}>
          {DAYS.map((day, idx) => (
            <View
              key={idx}
              style={[styles.dayItem, idx === todayIndex && styles.activeDay]}
            >
              <Text
                style={[
                  styles.dayText,
                  idx === todayIndex && styles.activeDayText,
                ]}
              >
                {day}
              </Text>
              {idx === todayIndex && (
                <Text style={styles.dayNumber}>{todayDate}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.progressCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.progressTitle}>Progress:</Text>
            <Text style={styles.progressText}>
              You’ve completed this much of your task so far.
            </Text>
          </View>
          <AnimatedCircularProgress
            size={80}
            width={8}
            fill={calculateCompletion()}
            tintColor="#00e0ff"
            backgroundColor="#eee"
            rotation={0}
            style={{ marginRight: 10 }}
          >
            {(fill) => (
              <View style={{ alignItems: "center" }}>
                <Text style={styles.percentText}>{`${Math.round(fill)}%`}</Text>
                <Text style={styles.percentSubText}>Completed</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.taskHeader}>
          <Text style={styles.sectionTitle}>Today’s tasks</Text>
          <TouchableOpacity onPress={() => setFilterStatus("All")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filters}>
          <TouchableOpacity
            style={
              filterStatus.toLowerCase() === "pending"
                ? styles.activeFilter
                : styles.inactiveFilter
            }
            onPress={() => setFilterStatus("Pending")}
          >
            <Text
              style={
                filterStatus.toLowerCase() === "pending"
                  ? styles.activeFilterText
                  : styles.inactiveFilterText
              }
            >
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              filterStatus.toLowerCase() === "completed"
                ? styles.activeFilter
                : styles.inactiveFilter
            }
            onPress={() => setFilterStatus("Completed")}
          >
            <Text
              style={
                filterStatus.toLowerCase() === "completed"
                  ? styles.activeFilterText
                  : styles.inactiveFilterText
              }
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.taskList}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2e6ef7"
              style={{ marginTop: 20 }}
            />
          ) : visibleTasks.length === 0 ? (
            <Text
              style={{
                marginTop: 20,
                textAlign: "center",
                color: "#888",
                width: "100%",
              }}
            >
              No tasks found
            </Text>
          ) : (
            visibleTasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <TaskCard
                  task={task}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TaskForm")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  hello: { fontSize: 18, color: "#444" },
  name: { fontSize: 22, fontWeight: "bold", color: "#000" },
  avatar: { width: 45, height: 45, borderRadius: 22 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    padding: 10,
    marginTop: 15,
  },
  dayBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  dayItem: { alignItems: "center", padding: 6, borderRadius: 10 },
  dayText: { color: "#888" },
  dayNumber: { fontSize: 14, color: "#555" },
  activeDay: { backgroundColor: "#2e6ef7", paddingHorizontal: 10 },
  activeDayText: { color: "#fff", fontWeight: "bold" },
  progressCard: {
    backgroundColor: "#2e6ef7",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  progressTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  progressText: { color: "#e6e6e6", marginTop: 4, fontSize: 13, width: 150 },
  percentText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  percentSubText: { color: "#fff", fontSize: 10 },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold" },
  seeAll: { fontSize: 14, color: "#2e6ef7" },
  filters: { flexDirection: "row", marginVertical: 15 },
  activeFilter: {
    backgroundColor: "#2e6ef7",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
  },
  activeFilterText: { color: "#fff" },
  inactiveFilter: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  inactiveFilterText: { color: "#555" },
  taskList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 80,
  },
  taskCard: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#2e6ef7",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabIcon: { color: "white", fontSize: 32, lineHeight: 36 },
});
