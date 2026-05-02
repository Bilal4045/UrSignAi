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
      <View style={styles.mainContent}>
        <Text style={styles.brandName}>UrSign AI</Text>
        <Image source={require('../assets/signimage.png')} style={styles.heroImage} resizeMode="contain" />
        <Text style={styles.subtitle}>Empowering the deaf community of Pakistan through AI-driven Sign Language Translation.</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={globalStyles.primaryBtn} onPress={() => router.push('/login')}>
          <Text style={globalStyles.btnText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.grayBorderBtn} onPress={() => router.push('/signup')}>
          <Text style={{ color: Colors.primary, fontWeight: 'bold', fontSize: 18 }}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  brandName: { fontSize: 36, fontWeight: 'bold', color: Colors.primary, marginBottom: 10 },
  heroImage: { width: width * 0.85, height: width * 0.75, marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', paddingHorizontal: 40, lineHeight: 24 },
  buttonContainer: { padding: 30, paddingBottom: 50 },
  grayBorderBtn: { borderWidth: 1, borderColor: '#E0E0E0', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 }
});