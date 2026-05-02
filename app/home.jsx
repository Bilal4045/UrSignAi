import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import Colors from '../constants/Colors';
import { getCategories } from '../services/lessonData';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('home');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedLessons, setWatchedLessons] = useState(new Set());

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const getCategoryProgress = (category) => {
    if (!category) return 0;
    const watchedInCat = category.lessons.filter(l => watchedLessons.has(l.id)).length;
    return Math.round((watchedInCat / category.lessons.length) * 100);
  };

  if (categories.length === 0) return null;

  if (isPlaying && selectedCategory) {
    const currentLesson = selectedCategory.lessons[currentIndex];
    return (
      <View style={styles.playerWrapper}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => setIsPlaying(false)}>
          <Ionicons name="close-circle" size={45} color="#FFF" />
        </TouchableOpacity>
        <Video source={currentLesson.video} style={styles.videoPlayer} useNativeControls resizeMode={ResizeMode.CONTAIN} shouldPlay />
        <View style={styles.playerInfo}>
          <Text style={styles.catTitleInPlayer}>{selectedCategory.title}</Text>
          <View style={styles.navRow}>
            <TouchableOpacity style={[styles.navBtn, currentIndex === 0 && { opacity: 0.3 }]} onPress={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)} disabled={currentIndex === 0}>
              <Ionicons name="play-back" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} onPress={() => {
                setWatchedLessons(prev => new Set([...prev, currentLesson.id]));
                if (currentIndex < selectedCategory.lessons.length - 1) setCurrentIndex(currentIndex + 1);
                else setIsPlaying(false);
              }}>
              <Text style={styles.navBtnText}>{currentIndex === selectedCategory.lessons.length - 1 ? "Finish" : "Next"}</Text>
              <Ionicons name="play-forward" size={30} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.dashboard} 
        showsVerticalScrollIndicator={false}
      >
        {/* Title is now moved down from the edge */}
        <Text style={styles.welcomeTitle}>UrSign Learning</Text>
        
        <View style={styles.grid}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard} onPress={() => { setSelectedCategory(cat); setCurrentIndex(0); setIsPlaying(true); }}>
              <View style={styles.iconBox}><Ionicons name="school" size={32} color={Colors.primary} /></View>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.barBg}><View style={[styles.barFill, { width: `${getCategoryProgress(cat)}%` }]} /></View>
                <Text style={styles.percentText}>{getCategoryProgress(cat)}%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation is now "floating" slightly above the bottom edge */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
            <NavItem active={activeTab === 'home'} icon="home" label="Home" onPress={() => setActiveTab('home')} />
            <NavItem active={activeTab === 'practice'} icon="fitness" label="Practice" onPress={() => setActiveTab('practice')} />
            <NavItem active={activeTab === 'translate'} icon="camera" label="Translate" onPress={() => setActiveTab('translate')} />
            <NavItem active={activeTab === 'chatbot'} icon="chatbubbles" label="Chatbot" onPress={() => setActiveTab('chatbot')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const NavItem = ({ active, icon, label, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color={active ? Colors.primary : '#999'} />
    <Text style={[styles.navLabel, active && { color: Colors.primary }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  dashboard: { 
    paddingHorizontal: 20, 
    paddingTop: 40, // MOVED TITLE DOWN: Added more top padding
    paddingBottom: 120 
  },
  welcomeTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#333',
    marginBottom: 25,
    marginTop: 10 // Extra spacing from the status bar
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: { backgroundColor: '#FFF', width: '48%', borderRadius: 20, padding: 15, marginBottom: 15, elevation: 3, alignItems: 'center' },
  iconBox: { width: 55, height: 55, borderRadius: 12, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  categoryTitle: { fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  progressBarContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  barBg: { flex: 1, height: 4, backgroundColor: '#EEE', borderRadius: 2, marginRight: 5 },
  barFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  percentText: { fontSize: 10, color: '#666' },

  // UPDATED BOTTOM NAV: Moved upward and styled as a floating bar
  bottomNavContainer: {
    position: 'absolute',
    bottom: 25, // LIFTS NAVIGATION UP: Moved it away from the bottom edge
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomNav: { 
    width: '100%',
    height: 75, 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    borderRadius: 25, // Rounded corners for professional look
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 10, marginTop: 4 },

  playerWrapper: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  videoPlayer: { width: '100%', height: '50%' },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  playerInfo: { padding: 20, alignItems: 'center' },
  catTitleInPlayer: { color: '#FFF', fontSize: 20, marginBottom: 20 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  navBtn: { flexDirection: 'row', backgroundColor: Colors.primary, padding: 15, borderRadius: 15, width: '45%', justifyContent: 'center', alignItems: 'center' },
  navBtnText: { color: '#FFF', fontWeight: 'bold', marginRight: 10 }
});