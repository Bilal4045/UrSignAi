import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Ensure the path to your service is correct
import { getDailyProgress } from '../services/progressService'; 

const THEME_GREEN = '#008080';
const { width } = Dimensions.get('window');

export default function LMSPage() {
  const router = useRouter();
  
  // State for tracked progress
  const [watchedVideos, setWatchedVideos] = useState([]); 
  const [stats, setStats] = useState({ count: 0, goal: 10, percentage: 0 });

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await getDailyProgress();
        if (data) {
          setWatchedVideos(data.watchedIds || []);
          setStats(data);
        }
      } catch (err) {
        console.error("LMS Load Error:", err);
      }
    };
    loadProgress();
  }, []);

  // DEFINING THIS INSIDE PREVENTS THE "STYLES NOT DEFINED" ERROR
  const ModuleNode = ({ id, title, signs, type }) => {
    const isDone = watchedVideos.includes(id);

    return (
      <View style={styles.nodeWrapper}>
        <View style={styles.connectorLine} />
        <TouchableOpacity 
          style={[styles.moduleNode, isDone && styles.doneNode]}
          activeOpacity={0.7}
        >
          <View style={[styles.statusIcon, isDone && { backgroundColor: '#4CAF50' }]}>
            {isDone ? (
              <Ionicons name="checkmark" size={20} color="#FFF" />
            ) : (
              <Ionicons name="play" size={18} color={THEME_GREEN} />
            )}
          </View>
          
          <View style={styles.nodeTextContent}>
            <Text style={styles.nodeTitle}>{title}</Text>
            <Text style={styles.nodeSubtitle}>
              {signs} signs • {type}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learning Path</Text>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{stats.count * 10} XP</Text>
          </View>
        </View>

        {/* DYNAMIC PROGRESS BAR */}
        <View style={styles.focusCard}>
          <View style={styles.focusInfo}>
            <Text style={styles.focusCount}>{stats.goal - stats.count}</Text>
            <Text style={styles.focusLabel}>Videos left today</Text>
          </View>
          
          <View style={styles.roundProgressContainer}>
            <View style={[
              styles.roundBarBase, 
              { 
                borderTopColor: stats.percentage > 0 ? THEME_GREEN : '#EEE', 
                borderRightColor: stats.percentage >= 50 ? THEME_GREEN : '#EEE' 
              }
            ]}>
              <View style={styles.roundBarInner}>
                <Text style={styles.innerPercentText}>{Math.round(stats.percentage)}%</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.chapterLabel}>CHAPTER 1: FOUNDATIONS</Text>
        
        {/* IDs must match what you pass to markLessonAsLearned() in your video player */}
        <ModuleNode id="lesson_1" title="PSL Alphabets" signs="26" type="Video" />
        <ModuleNode id="lesson_2" title="Numbers 1-10" signs="10" type="Video" />
        <ModuleNode id="lesson_3" title="Basic Greetings" signs="12" type="Video" />
        
        <Text style={[styles.chapterLabel, { marginTop: 20 }]}>CHAPTER 2: DAILY LIFE</Text>
        <ModuleNode id="lesson_4" title="Family Members" signs="15" type="Video" />
        <ModuleNode id="lesson_5" title="Common Verbs" signs="20" type="Video" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9F9' },
  topSection: { 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  xpBadge: { backgroundColor: '#E0F2F1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  xpText: { color: THEME_GREEN, fontWeight: 'bold', fontSize: 12 },

  focusCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  focusInfo: { flex: 1 },
  focusCount: { fontSize: 42, fontWeight: '900', color: '#333' },
  focusLabel: { fontSize: 14, color: '#888', marginTop: -5 },

  roundProgressContainer: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  roundBarBase: { 
    width: 70, height: 70, borderRadius: 35, borderWidth: 6, borderColor: '#EEE', 
    justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '45deg' }] 
  },
  roundBarInner: { 
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', 
    justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '-45deg' }] 
  },
  innerPercentText: { fontWeight: 'bold', fontSize: 14, color: '#333' },

  scrollContent: { padding: 20, paddingTop: 30, paddingBottom: 100 },
  chapterLabel: { fontSize: 12, fontWeight: '800', color: '#BBB', letterSpacing: 1, marginBottom: 15 },

  nodeWrapper: { alignItems: 'center' },
  connectorLine: { width: 3, height: 15, backgroundColor: '#EEE' },
  moduleNode: { 
    width: '100%', backgroundColor: '#FFF', padding: 18, borderRadius: 22, 
    flexDirection: 'row', alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 
  },
  doneNode: { borderLeftWidth: 5, borderLeftColor: '#4CAF50' },
  statusIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  nodeTextContent: { flex: 1, marginLeft: 15 },
  nodeTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  nodeSubtitle: { fontSize: 12, color: '#999', marginTop: 2 }
});