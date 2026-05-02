import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { globalStyles } from '../styles/globalStyles';

export default function SignupScreen() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={[globalStyles.container, { justifyContent: 'center' }]}>
      <Text style={styles.brandName}>UrSign AI</Text>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={globalStyles.input} placeholder="Full Name" placeholderTextColor="#999" />
      <TextInput style={globalStyles.input} placeholder="Email Address" placeholderTextColor="#999" />
      <TextInput style={globalStyles.input} placeholder="Password" secureTextEntry placeholderTextColor="#999" />
      <TouchableOpacity style={globalStyles.primaryBtn} onPress={() => router.replace('/home')}>
        <Text style={globalStyles.btnText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={globalStyles.footerText}>Already have an account? <Text style={globalStyles.linkText}>Login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  brandName: { fontSize: 36, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: Colors.textMain, marginBottom: 20 }
});