import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To -Do List ✅</Text>

      <Image
        source={require('../assets/images/welcome.png')} // Replace with actual path
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Welcome To Do Task</Text>
      <Text style={styles.description}>
        Thank you for choosing DoTask to support your productivity. Let's begin
        the adventure of organizing activities more efficiently!
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Let’s start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007BFF', // Blue background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#f0f0f0',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
  },
  buttonText: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
