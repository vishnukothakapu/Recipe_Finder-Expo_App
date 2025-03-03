import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function About() {
  return (
    <View style={styles.container}>
          <Text style={styles.title}>App Info</Text>
      <Image source={require('../../assets/images/app_icon.jpg')} style={styles.image} />
      <Text style={styles.text}>Recipe Finder</Text>
      <Text style={styles.text}>Version: 1.0.0</Text>
      <Text style={styles.text}>Crafted by: Vishnu❤️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  image:{
    width:100,
    height:100,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
  },
});
