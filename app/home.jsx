import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import { getDailyProgress } from '../services/progressService'; 

const { width, height } = Dimensions.get('window');
const THEME_GREEN = '#008080';

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({ count: 0, goal: 10, percentage: 0 });

  useEffect(() => {
    const syncProgress = async () => {
      try {
        const data = await getDailyProgress();
        if (data) setStats(data);
      } catch (err) {
        console.error("Home sync error:", err);
      }
    };
    syncProgress();
  }, []);

  const ModuleCard = ({ title, icon, color, iColor, onPress }) => (
    <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconBg, {backgroundColor: color}]}>
        <Ionicons name={icon} size={28} color={iColor} />
      </View>
      <Text style={styles.gridLabel}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* MAIN CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>UrSign AI</Text>
            <Text style={styles.date}>Mastering Pakistan Sign Language</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Ionicons name="person-circle-outline" size={40} color={THEME_GREEN} />
          </TouchableOpacity>
        </View>

        {/* LMS PROGRESS MASTER CARD */}
        <TouchableOpacity 
          style={styles.lmsMasterCard} 
          onPress={() => router.push('/lms')}
          activeOpacity={0.9}
        >
          <View style={styles.lmsLeft}>
            <View style={styles.lmsBadge}>
              <Text style={styles.lmsBadgeText}>DAILY GOAL</Text>
            </View>
            <Text style={styles.lmsTitle}>{stats.goal - stats.count} Videos Left</Text>
            <Text style={styles.lmsSubtitle}>
              Progress: {stats.count}/{stats.goal} lessons
            </Text>
          </View>

          <View style={styles.progressCircleContainer}>
            <View style={[
              styles.outerCircle, 
              { 
                borderTopColor: stats.percentage > 0 ? '#FFF' : 'rgba(255,255,255,0.2)', 
                borderRightColor: stats.percentage >= 50 ? '#FFF' : 'rgba(255,255,255,0.2)',
                transform: [{ rotate: '45deg' }] 
              }
            ]}>
               <View style={[styles.innerCircle, { transform: [{ rotate: '-45deg' }] }]}>
                  <Text style={styles.percentText}>{Math.round(stats.percentage)}%</Text>
               </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* MODULES GRID */}
        <Text style={styles.sectionTitle}>Translation Tools</Text>
        <View style={styles.grid}>
          <ModuleCard title="Sign to Urdu" icon="videocam" color="#E0F2F1" iColor={THEME_GREEN} onPress={() => router.push('/signtourdu')} />
          <ModuleCard title="Urdu to Sign" icon="text" color="#FFF3E0" iColor="#FF9800" onPress={() => router.push('/urdutosign')} />
        </View>

        <Text style={styles.sectionTitle}>Practice & Assessment</Text>
        <View style={styles.grid}>
          <ModuleCard title="AI Practice" icon="fitness" color="#F3E5F5" iColor="#9C27B0" onPress={() => router.push('/PracticeScreen')} />
          <ModuleCard title="Daily Quiz" icon="help-circle" color="#E8EAF6" iColor="#3F51B5" onPress={() => router.push('/quiz')} />
        </View>

        {/* RESOURCES (Path Fixed: removed .jsx) */}
        <Text style={styles.sectionTitle}>Resources</Text>
        <TouchableOpacity 
          style={styles.wideCard} 
          onPress={() => router.push('/lesson')}
        >
          <View style={[styles.iconBg, { backgroundColor: '#E1F5FE', marginBottom: 0 }]}>
            <Ionicons name="book" size={24} color="#03A9F4" />
          </View>
          <View style={styles.wideCardText}>
            <Text style={styles.wideCardTitle}>PSL Dictionary</Text>
            <Text style={styles.wideCardSub}>Browse 1000+ sign meanings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

      </ScrollView>

      {/* FLOATING CHATBOT BUTTON (Bottom Right) */}
      <TouchableOpacity 
        style={styles.floatingChatButton} 
        onPress={() => router.push('/chat')}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="#FFF" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFA' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  brand: { fontSize: 26, fontWeight: '900', color: THEME_GREEN },
  date: { fontSize: 14, color: '#888' },
  
  lmsMasterCard: { 
    backgroundColor: THEME_GREEN, 
    borderRadius: 25, padding: 25, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10
  },
  lmsLeft: { flex: 1 },
  lmsBadge: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  lmsBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  lmsTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  lmsSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },

  progressCircleContainer: { width: 90, height: 90, justifyContent: 'center', alignItems: 'center' },
  outerCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 6, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  percentText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 25, marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { 
    width: (width - 55) / 2, 
    backgroundColor: '#FFF', padding: 20, borderRadius: 22, alignItems: 'center', marginBottom: 15,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  iconBg: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  gridLabel: { fontWeight: '700', color: '#444', fontSize: 14 },

  wideCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    padding: 15, borderRadius: 22, marginBottom: 20,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  wideCardText: { flex: 1, marginLeft: 15 },
  wideCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  wideCardSub: { fontSize: 13, color: '#888' },

  // STYLES FOR THE FLOATING BUTTON
  floatingChatButton: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: THEME_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  }
});