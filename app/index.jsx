import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { globalStyles } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {/* This container now centers everything vertically and horizontally */}
      <View style={styles.container}>
        
        {/* Top Section: Title */}
        <Text style={styles.brandName}>UrSign AI</Text>
        
        {/* Image Section */}
        <Image 
          source={require('../assets/signimage.png')} 
          style={styles.heroImage} 
          resizeMode="contain" 
        />
        
        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>
            Empowering the deaf community of Pakistan through AI-driven Sign Language Translation.
          </Text>
        </View>
        
        {/* Button Section */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={globalStyles.primaryBtn} onPress={() => router.push('/login')}>
            <Text style={globalStyles.btnText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.grayBorderBtn} onPress={() => router.push('/signup')}>
            <Text style={{ color: Colors.primary, fontWeight: 'bold', fontSize: 18 }}>Create Account</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center', // KEY: This centers the whole block vertically
    paddingHorizontal: 20,    // General side padding
  },
  brandName: { 
    fontSize: 40, 
    fontWeight: '800', 
    color: Colors.primary, 
    letterSpacing: 1,
    marginBottom: 10, 
  },
  heroImage: { 
    width: width * 0.85, 
    height: width * 0.75, 
    marginVertical: -10, // Adjust this if your image has built-in white space
  },
  textContainer: {
    paddingHorizontal: 20,
    marginBottom: 40, // Space between text and the buttons
  },
  subtitle: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#555', 
    lineHeight: 22,
  },
  buttonWrapper: { 
    width: '100%',
    paddingHorizontal: 10,
  },
  grayBorderBtn: { 
    borderWidth: 1.5, 
    borderColor: '#F0F0F0', 
    padding: 16, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 15,
    backgroundColor: '#FAFAFA' 
  }
});