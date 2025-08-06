import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { auth } from "../services/firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { FontAwesome, Feather } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID =
  "58181323393-t31snshmp4qa3kcf04dv82b073qesu9h.apps.googleusercontent.com";

const googleDiscovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  // No tokenEndpoint to avoid PKCE error
};

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google auth request config
  const [googleRequest, googleResponse, promptGoogleSignIn] = useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ["profile", "email"],
      redirectUri: "https://auth.expo.io/@arun2005/frontend",
      // responseType: "id_token",
    },
    googleDiscovery
  );

  console.log(makeRedirectUri({ useProxy: true }));

  useEffect(() => {
    // Handle Google OAuth response
    if (googleResponse?.type === "success") {
      const { id_token } = googleResponse.params;
      if (!id_token) {
        Alert.alert("Google sign-in failed", "No token returned from Google.");
        setLoading(false);
        return;
      }
      setLoading(true);
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          setLoading(false);
          navigation.replace("Home");
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert("Login failed", error.message);
        });
    } else if (googleResponse?.type === "error") {
      Alert.alert("Google login error", googleResponse.error || "Unknown error");
      setLoading(false);
    }
  }, [googleResponse]);

  const handleGoogleSignIn = async () => {
    if (!googleRequest) {
      Alert.alert("Error", "Google Auth Request is not ready.");
      return;
    }
    setLoading(true);
    try {
      await promptGoogleSignIn();
    } catch (error) {
      setLoading(false);
      Alert.alert("Login failed", error.message);
    }
  };

  const handleLoginPress = () => {
    // Optional username/password login
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Image
        source={require("../assets/images/login-illustration.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Username */}
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="User name"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          editable={!loading}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Feather name="lock" size={20} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          editable={!loading}
        />
      </View>

      {/* Remember Me */}
      <TouchableOpacity
        style={styles.checkboxWrapper}
        onPress={() => setRememberMe(!rememberMe)}
        disabled={loading}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
          {rememberMe && <Feather name="check" size={14} color="#fff" />}
        </View>
        <Text style={styles.rememberText}>Remember the pass</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLoginPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity disabled={loading}>
        <Text style={styles.forgotText}>Forget password?</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.orText}>Or sign in with</Text>

      {/* Google Sign In */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={!googleRequest || loading}
      >
        <Image
          source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 250,
    height: 180,
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 8,
    width: "85%",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
    color: "#000",
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    marginVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#2e6ef7",
    borderColor: "#2e6ef7",
  },
  rememberText: {
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#2e6ef7",
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 25,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  forgotText: {
    color: "#999",
    marginBottom: 12,
  },
  orText: {
    color: "#888",
    marginVertical: 6,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    marginBottom: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 15,
  },
});
