import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';

// Import your services
import { getCategories } from '../services/lessonData';
import { markLessonAsLearned } from '../services/progressService';

const THEME_GREEN = '#008080';
const { width, height } = Dimensions.get('window');

export default function LessonScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Fetch categories from your service
    getCategories().then(data => setCategories(data));
  }, []);

  // Function to handle progress update when a user finishes a video
  const handleNextLesson = async () => {
    // 1. Mark as learned in the service layer
    await markLessonAsLearned();
    console.log("Lesson learned! Progress updated.");

    // 2. Move to next video or close player
    if (currentIndex < selectedCategory.lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsPlaying(false); // Close player if it was the last video in category
    }
  };

  // --- VIEW 1: FULL SCREEN VIDEO PLAYER ---
  if (isPlaying && selectedCategory) {
    const currentLesson = selectedCategory.lessons[currentIndex];
    
    return (
      <View style={styles.playerWrapper}>
        {/* Close Player Button */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => setIsPlaying(false)}>
          <Ionicons name="close-circle" size={50} color="#FFF" />
        </TouchableOpacity>

        <Video 
          source={currentLesson.video} 
          style={styles.videoPlayer} 
          useNativeControls 
          resizeMode={ResizeMode.CONTAIN} 
          shouldPlay 
        />

        <View style={styles.playerInfo}>
          <Text style={styles.catTitleInPlayer}>{selectedCategory.title}</Text>
          <Text style={styles.lessonCount}>
            Video {currentIndex + 1} of {selectedCategory.lessons.length}
          </Text>
          
          <View style={styles.navRow}>
            {/* Previous Button */}
            <TouchableOpacity 
              style={[styles.navBtn, { opacity: currentIndex === 0 ? 0.3 : 1 }]} 
              onPress={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <Ionicons name="play-back" size={24} color="#FFF" />
              <Text style={styles.navBtnText}>Prev</Text>
            </TouchableOpacity>

            {/* Next / Finish Button */}
            <TouchableOpacity 
              style={styles.navBtn} 
              onPress={handleNextLesson}
            >
              <Text style={styles.navBtnText}>
                {currentIndex === selectedCategory.lessons.length - 1 ? "Finish" : "Next"}
              </Text>
              <Ionicons name="play-forward" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // --- VIEW 2: CATEGORY GRID ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={THEME_GREEN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Library</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            style={styles.categoryCard} 
            onPress={() => { 
              setSelectedCategory(cat); 
              setCurrentIndex(0); 
              setIsPlaying(true); 
            }}
          >
            <View style={styles.iconBox}>
              <Ionicons 
                name={cat.id === 'urdu_alphabets' ? 'text' : 'school'} 
                size={35} 
                color={THEME_GREEN} 
              />
            </View>
            <Text style={styles.categoryTitle}>{cat.title}</Text>
            <Text style={styles.itemCount}>{cat.lessons.length} Videos</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: THEME_GREEN },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    padding: 20 
  },
  categoryCard: { 
    backgroundColor: '#F9F9F9', 
    width: '47%', 
    borderRadius: 25, 
    padding: 20, 
    marginBottom: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
  },
  iconBox: { 
    width: 70, 
    height: 70, 
    borderRadius: 20, 
    backgroundColor: '#E0F2F1', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  categoryTitle: { fontWeight: 'bold', fontSize: 16, color: '#333', textAlign: 'center' },
  itemCount: { fontSize: 12, color: THEME_GREEN, marginTop: 4, fontWeight: '600' },
  
  // Video Player Styles
  playerWrapper: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  videoPlayer: { width: '100%', height: height * 0.45 },
  closeBtn: { position: 'absolute', top: 60, right: 25, zIndex: 10 },
  playerInfo: { padding: 30, alignItems: 'center' },
  catTitleInPlayer: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  lessonCount: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 30 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  navBtn: { 
    flexDirection: 'row', 
    backgroundColor: THEME_GREEN, 
    padding: 15, 
    borderRadius: 15, 
    width: '45%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  navBtnText: { color: '#FFF', fontWeight: 'bold', marginHorizontal: 8, fontSize: 16 }
});