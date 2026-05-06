import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { globalStyles } from '../styles/globalStyles';
import { supabase } from '../libs/supabase';

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // --- Validations ---
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // --- Supabase signup ---
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else if (data.session === null) {
      // Email confirmation is enabled in Supabase
      Alert.alert(
        'Confirm your Email',
        'A confirmation link has been sent to your email. Please verify before logging in.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } else {
      // Email confirmation is disabled — user is logged in directly
      router.replace('/home');
    }
  };

  return (
    <ScrollView contentContainerStyle={[globalStyles.container, { justifyContent: 'center' }]}>
      <Text style={styles.brandName}>UrSign AI</Text>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Email Address"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Confirm Password"
        secureTextEntry
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[globalStyles.primaryBtn, loading && { opacity: 0.7 }]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={globalStyles.btnText}>Sign Up</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={globalStyles.footerText}>
          Already have an account? <Text style={globalStyles.linkText}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  brandName: { fontSize: 36, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: Colors.textMain, marginBottom: 20 },
});