// app/home.tsx  (or pages/home.tsx if using expo-router)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Hello</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // center vertically
    alignItems: 'center', // center horizontally
    backgroundColor: '#fff', // optional
  },
  helloText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
