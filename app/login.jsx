import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { globalStyles } from '../styles/globalStyles';

export default function LoginScreen() {
  const router = useRouter();
  return (
    <View style={[globalStyles.container, { justifyContent: 'center' }]}>
      <Text style={styles.brandName}>UrSign AI</Text>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account to continue</Text>
      <TextInput style={globalStyles.input} placeholder="Email Address" placeholderTextColor="#999" />
      <TextInput style={globalStyles.input} placeholder="Password" secureTextEntry placeholderTextColor="#999" />
      <TouchableOpacity style={globalStyles.primaryBtn} onPress={() => router.replace('/home')}>
        <Text style={globalStyles.btnText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={globalStyles.footerText}>Don't have an account? <Text style={globalStyles.linkText}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  brandName: { fontSize: 36, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: Colors.textMain },
  subtitle: { fontSize: 16, textAlign: 'center', color: Colors.textSecondary, marginBottom: 30 }
});