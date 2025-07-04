import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1548827752-6301e20b3be0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbmdhfGVufDB8fDB8fHww'}}
        style={styles.heroImage}
      />
      <Text style={styles.title}>Welcome to the Manga Reader!</Text>
      <Text style={styles.subtitle}>Browse Thousands of manga</Text>
      {<Button
        title="Go to browse"
        onPress={() => console.log("Browse screen placeholder")}
      />}
      <View style={{marginTop: 10}}>
        <Button 
          title="Get Started" 
          onPress={() => console.log("Signup placeholder")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heroImage: {
    width:'100%',
    height: 150,
    marginBottom:20,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  title: {
    fonttSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    color: '#666',
    marginBottom: 10,
  },
});
