import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';

// Import the Service Layer
import { getDailyProgress } from '../services/progressService';

const { width } = Dimensions.get('window');
const THEME_GREEN = '#008080';

export default function HomeScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState({ count: 0, percentage: 0, goal: 10 });

  // Refresh progress whenever this screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchProgress = async () => {
        const data = await getDailyProgress();
        setProgress(data);
      };
      fetchProgress();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Assalam-o-Alaikum,</Text>
            <Text style={styles.brandText}>UrSign AI</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle" size={45} color={THEME_GREEN} />
          </TouchableOpacity>
        </View>

        {/* 2. Dynamic Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Daily Progress</Text>
            <Text style={styles.progressSubtitle}>
              {progress.count} of {progress.goal} signs learned today
            </Text>
            <View style={styles.fullProgressBar}>
              <View style={[styles.filledProgressBar, { width: `${progress.percentage}%` }]} />
            </View>
          </View>
          <View style={styles.percentageCircle}>
            <Text style={styles.percentageText}>{Math.round(progress.percentage)}%</Text>
          </View>
        </View>

        {/* 3. Learning Modules Section */}
        <Text style={styles.sectionTitle}>Learning Modules</Text>
        <View style={styles.moduleGrid}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/PracticeScreen')}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="fitness" size={30} color={THEME_GREEN} />
            </View>
            <Text style={styles.cardText}>Practice Signs</Text>
            <Text style={styles.cardDesc}>AI-driven feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('/lesson')}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="book" size={30} color={THEME_GREEN} />
            </View>
            <Text style={styles.cardText}>Sign Library</Text>
            <Text style={styles.cardDesc}>Watch & Learn</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Translation Tools Section */}
        <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Translation Tools</Text>
        <View style={styles.moduleGrid}>
          
          {/* Urdu to Sign Card */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push('/urdutosign')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="text" size={30} color={THEME_GREEN} />
            </View>
            <Text style={styles.cardText}>Urdu to Sign</Text>
            <Text style={styles.cardDesc}>Text to Video</Text>
          </TouchableOpacity>

          {/* Sign to Urdu Card */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push('/signtourdu')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="videocam" size={30} color={THEME_GREEN} />
            </View>
            <Text style={styles.cardText}>Sign to Urdu</Text>
            <Text style={styles.cardDesc}>Video to Text</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  welcomeText: { fontSize: 16, color: '#666' },
  brandText: { fontSize: 28, fontWeight: 'bold', color: THEME_GREEN },
  progressCard: {
    backgroundColor: THEME_GREEN,
    borderRadius: 25,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 8,
  },
  progressInfo: { flex: 1, marginRight: 15 },
  progressTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  progressSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  fullProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginTop: 15,
    width: '100%',
    overflow: 'hidden'
  },
  filledProgressBar: { height: '100%', backgroundColor: '#FFF', borderRadius: 4 },
  percentageCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  percentageText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  moduleGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  card: {
    backgroundColor: '#F9F9F9',
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    elevation: 2,
  },
  iconContainer: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardText: { fontSize: 15, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  cardDesc: { fontSize: 11, color: '#777', marginTop: 4, textAlign: 'center' },
});